import { and, asc, desc, eq, like, sql } from 'drizzle-orm';
import { queryParams } from '~~/server/db/query.helper';
import {
  NewResourceDatabase,
  ResourceDatabase,
  resourceDatabaseTable
} from '~~/server/db/schema/admin/resourceDatabase';

type ResourceDatabasePageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    status: string;
  }
>;

type ResourceDatabaseMutationBody = Partial<
  NewResourceDatabase & {
    id?: number;
    databaseId?: number;
    coverUrl?: string;
  }
>;

export class ResourceDatabaseServices {
  async pageList(params?: ResourceDatabasePageParams) {
    const { pageNum = 1, pageSize = 10, title, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(resourceDatabaseTable.delFlag, '0')];

    if (title) {
      whereList.push(like(resourceDatabaseTable.title, `%${title}%`));
    }

    if (this.isValidStatus(status)) {
      whereList.push(eq(resourceDatabaseTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.resourceDatabaseTable.findMany({
      extras: {
        id: sql<number>`${resourceDatabaseTable.databaseId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: table => [asc(table.sort), desc(table.databaseId)]
    });
    const totalQuery = db.$count(resourceDatabaseTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapEntity(row)),
      total
    };
  }

  async publicList() {
    const rows = await db.query.resourceDatabaseTable.findMany({
      where: and(eq(resourceDatabaseTable.delFlag, '0'), eq(resourceDatabaseTable.status, 'active')),
      orderBy: table => [asc(table.sort), desc(table.databaseId)]
    });

    return {
      total: rows.length,
      list: rows.map(row => ({
        id: String(row.databaseId),
        title: row.title,
        status: row.status || 'active',
        info: row.info || '',
        url: row.url || '',
        icon: row.icon || '',
        coverUrl: row.coverUrl || '',
        sort: row.sort || 0
      }))
    };
  }

  async getById(databaseId: number) {
    return this.mapEntity(await this.findById(databaseId));
  }

  async add(body: ResourceDatabaseMutationBody, userName = 'system') {
    const payload = this.normalizeMutationBody(body, userName);
    const [inserted] = await db.insert(resourceDatabaseTable).values(payload).$returningId();
    return this.getById(inserted.databaseId);
  }

  async update(body: ResourceDatabaseMutationBody, userName = 'system') {
    const databaseId = Number(body.databaseId || body.id);
    if (!databaseId) {
      throw createError({ statusCode: 400, message: '缺少数据库资源ID' });
    }

    await this.findById(databaseId);
    const payload = this.normalizeMutationBody(body, userName, true);
    await db.update(resourceDatabaseTable).set(payload).where(eq(resourceDatabaseTable.databaseId, databaseId));
    return this.getById(databaseId);
  }

  async delete(databaseId: number, userName = 'system') {
    await this.findById(databaseId);
    await db.update(resourceDatabaseTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(resourceDatabaseTable.databaseId, databaseId));
  }

  private async findById(databaseId: number): Promise<ResourceDatabase> {
    if (!databaseId) {
      throw createError({ statusCode: 400, message: '缺少数据库资源ID' });
    }

    const row = await db.query.resourceDatabaseTable.findFirst({
      where: and(eq(resourceDatabaseTable.databaseId, databaseId), eq(resourceDatabaseTable.delFlag, '0'))
    });

    if (!row) {
      throw createError({ statusCode: 404, message: '数据库资源不存在' });
    }

    return row;
  }

  private normalizeMutationBody(body: ResourceDatabaseMutationBody, userName: string, isUpdate = false) {
    const payload: ResourceDatabaseMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      info: typeof body.info === 'string' ? body.info.trim() : '',
      url: typeof body.url === 'string' ? body.url.trim() : '',
      icon: typeof body.icon === 'string' ? body.icon.trim() : '',
      coverUrl: typeof body.coverUrl === 'string' ? body.coverUrl : '',
      status: this.isValidStatus(body.status) ? body.status : 'active',
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
      remark: typeof body.remark === 'string' ? body.remark : '',
      updateBy: userName,
      updateTime: new Date()
    };

    if (!payload.title) {
      throw createError({ statusCode: 400, message: '数据库名称不能为空' });
    }

    if (!isUpdate) {
      payload.createBy = userName;
      payload.createTime = new Date();
      payload.delFlag = '0';
    }

    return payload;
  }

  private mapEntity(row: ResourceDatabase & { id?: number }) {
    return {
      id: row.id || row.databaseId,
      databaseId: row.databaseId,
      title: row.title,
      info: row.info || '',
      url: row.url || '',
      icon: row.icon || '',
      coverUrl: row.coverUrl || '',
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
