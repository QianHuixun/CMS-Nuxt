import { and, asc, desc, eq, like, sql } from 'drizzle-orm';
import { queryParams } from '~~/server/db/query.helper';
import { NewResearchTool, ResearchTool, researchToolTable } from '~~/server/db/schema/admin/researchTool';

type ResearchToolPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    status: string;
  }
>;

type ResearchToolMutationBody = Partial<
  NewResearchTool & {
    id?: number;
    toolId?: number;
  }
>;

export class ResearchToolServices {
  async pageList(params?: ResearchToolPageParams) {
    const { pageNum = 1, pageSize = 10, title, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(researchToolTable.delFlag, '0')];

    if (title) {
      whereList.push(like(researchToolTable.title, `%${title}%`));
    }

    if (this.isValidStatus(status)) {
      whereList.push(eq(researchToolTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.researchToolTable.findMany({
      extras: {
        id: sql<number>`${researchToolTable.toolId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: table => [asc(table.sort), desc(table.toolId)]
    });
    const totalQuery = db.$count(researchToolTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapEntity(row)),
      total
    };
  }

  async publicList() {
    const rows = await db.query.researchToolTable.findMany({
      where: and(eq(researchToolTable.delFlag, '0'), eq(researchToolTable.status, 'active')),
      orderBy: table => [asc(table.sort), desc(table.toolId)]
    });

    return {
      total: rows.length,
      list: rows.map(row => ({
        id: String(row.toolId),
        title: row.title,
        description: row.description || '',
        icon: row.icon || '',
        url: row.url || '',
        sort: row.sort || 0
      }))
    };
  }

  async getById(toolId: number) {
    return this.mapEntity(await this.findById(toolId));
  }

  async add(body: ResearchToolMutationBody, userName = 'system') {
    const payload = this.normalizeMutationBody(body, userName);
    const [inserted] = await db.insert(researchToolTable).values(payload).$returningId();
    return this.getById(inserted.toolId);
  }

  async update(body: ResearchToolMutationBody, userName = 'system') {
    const toolId = Number(body.toolId || body.id);
    if (!toolId) {
      throw createError({ statusCode: 400, message: '缺少自研工具ID' });
    }

    await this.findById(toolId);
    const payload = this.normalizeMutationBody(body, userName, true);
    await db.update(researchToolTable).set(payload).where(eq(researchToolTable.toolId, toolId));
    return this.getById(toolId);
  }

  async delete(toolId: number, userName = 'system') {
    await this.findById(toolId);
    await db.update(researchToolTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(researchToolTable.toolId, toolId));
  }

  private async findById(toolId: number): Promise<ResearchTool> {
    if (!toolId) {
      throw createError({ statusCode: 400, message: '缺少自研工具ID' });
    }

    const row = await db.query.researchToolTable.findFirst({
      where: and(eq(researchToolTable.toolId, toolId), eq(researchToolTable.delFlag, '0'))
    });

    if (!row) {
      throw createError({ statusCode: 404, message: '自研工具不存在' });
    }

    return row;
  }

  private normalizeMutationBody(body: ResearchToolMutationBody, userName: string, isUpdate = false) {
    const payload: ResearchToolMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      url: typeof body.url === 'string' ? body.url.trim() : '',
      icon: typeof body.icon === 'string' ? body.icon.trim() : '',
      status: this.isValidStatus(body.status) ? body.status : 'active',
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
      remark: typeof body.remark === 'string' ? body.remark : '',
      updateBy: userName,
      updateTime: new Date()
    };

    if (!payload.title) {
      throw createError({ statusCode: 400, message: '工具名称不能为空' });
    }

    if (!isUpdate) {
      payload.createBy = userName;
      payload.createTime = new Date();
      payload.delFlag = '0';
    }

    return payload;
  }

  private mapEntity(row: ResearchTool & { id?: number }) {
    return {
      id: row.id || row.toolId,
      toolId: row.toolId,
      title: row.title,
      description: row.description || '',
      url: row.url || '',
      icon: row.icon || '',
      status: row.status || 'active',
      sort: row.sort || 0,
      remark: row.remark || '',
      createBy: row.createBy || '',
      createTime: row.createTime,
      updateBy: row.updateBy || '',
      updateTime: row.updateTime
    };
  }

  private isValidStatus(status?: string): status is 'active' | 'inactive' {
    return status === 'active' || status === 'inactive';
  }
}
