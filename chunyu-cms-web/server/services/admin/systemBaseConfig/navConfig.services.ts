import { and, asc, desc, eq, like, ne, sql } from 'drizzle-orm';
import { queryParams } from '~~/server/db/query.helper';
import { NavConfig, navConfigTable, NewNavConfig } from '~~/server/db/schema/admin/navConfig';

type NavConfigPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    status: string;
  }
>;

type NavConfigMutationBody = Partial<
  NewNavConfig & {
    id?: number;
    navConfigId?: number;
  }
>;

export class NavConfigServices {
  async pageList(params?: NavConfigPageParams) {
    const { pageNum = 1, pageSize = 10, title, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(navConfigTable.delFlag, '0')];

    if (title) {
      whereList.push(like(navConfigTable.title, `%${title}%`));
    }

    if (this.isValidStatus(status)) {
      whereList.push(eq(navConfigTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.navConfigTable.findMany({
      extras: {
        id: sql<number>`${navConfigTable.navConfigId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: table => [asc(table.sort), desc(table.navConfigId)]
    });
    const totalQuery = db.$count(navConfigTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapEntity(row)),
      total
    };
  }

  async publicList() {
    const rows = await db.query.navConfigTable.findMany({
      where: and(eq(navConfigTable.delFlag, '0'), eq(navConfigTable.status, 'active')),
      limit: 3,
      orderBy: table => [asc(table.sort), desc(table.navConfigId)]
    });

    return {
      total: rows.length,
      list: rows.map(row => ({
        id: String(row.navConfigId),
        title: row.title,
        description: row.description || '',
        url: row.url || '',
        icon: row.icon || '',
        sort: row.sort || 0
      }))
    };
  }

  async getById(navConfigId: number) {
    return this.mapEntity(await this.findById(navConfigId));
  }

  async add(body: NavConfigMutationBody, userName = 'system') {
    const payload = this.normalizeMutationBody(body, userName);
    await this.assertActiveLimit(payload.status);
    const [inserted] = await db.insert(navConfigTable).values(payload).$returningId();
    return this.getById(inserted.navConfigId);
  }

  async update(body: NavConfigMutationBody, userName = 'system') {
    const navConfigId = Number(body.navConfigId || body.id);
    if (!navConfigId) {
      throw createError({ statusCode: 400, message: '缺少导航配置ID' });
    }

    await this.findById(navConfigId);
    const payload = this.normalizeMutationBody(body, userName, true);
    await this.assertActiveLimit(payload.status, navConfigId);
    await db.update(navConfigTable).set(payload).where(eq(navConfigTable.navConfigId, navConfigId));
    return this.getById(navConfigId);
  }

  async delete(navConfigId: number, userName = 'system') {
    await this.findById(navConfigId);
    await db.update(navConfigTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(navConfigTable.navConfigId, navConfigId));
  }

  private async findById(navConfigId: number): Promise<NavConfig> {
    if (!navConfigId) {
      throw createError({ statusCode: 400, message: '缺少导航配置ID' });
    }

    const row = await db.query.navConfigTable.findFirst({
      where: and(eq(navConfigTable.navConfigId, navConfigId), eq(navConfigTable.delFlag, '0'))
    });

    if (!row) {
      throw createError({ statusCode: 404, message: '导航配置不存在' });
    }

    return row;
  }

  private normalizeMutationBody(body: NavConfigMutationBody, userName: string, isUpdate = false) {
    const payload: NavConfigMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      url: typeof body.url === 'string' ? body.url.trim() : '',
      icon: typeof body.icon === 'string' ? body.icon.trim() : '',
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
      status: this.isValidStatus(body.status) ? body.status : 'active',
      remark: typeof body.remark === 'string' ? body.remark : '',
      updateBy: userName,
      updateTime: new Date()
    };

    if (!payload.title) {
      throw createError({ statusCode: 400, message: '入口名称不能为空' });
    }

    if (!isUpdate) {
      payload.createBy = userName;
      payload.createTime = new Date();
      payload.delFlag = '0';
    }

    return payload;
  }

  private async assertActiveLimit(status?: string, excludeId?: number) {
    if (status !== 'active') return;

    const where = excludeId
      ? and(eq(navConfigTable.delFlag, '0'), eq(navConfigTable.status, 'active'), ne(navConfigTable.navConfigId, excludeId))
      : and(eq(navConfigTable.delFlag, '0'), eq(navConfigTable.status, 'active'));
    const activeCount = await db.$count(navConfigTable, where);

    if (activeCount >= 3) {
      throw createError({ statusCode: 400, message: '最多允许 3 个启用导航入口' });
    }
  }

  private mapEntity(row: NavConfig & { id?: number }) {
    return {
      id: row.id || row.navConfigId,
      navConfigId: row.navConfigId,
      title: row.title,
      description: row.description || '',
      url: row.url || '',
      icon: row.icon || '',
      sort: row.sort || 0,
      status: row.status || 'active',
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
