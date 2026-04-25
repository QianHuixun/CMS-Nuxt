import { and, desc, eq, inArray, like, sql } from 'drizzle-orm';
import { Activity, activityTable, NewActivity } from '~~/server/db/schema/admin/activity';
import { queryParams } from '~~/server/db/query.helper';

export class ActivityServices {
  /* 新增 */
  async add(body: NewActivity) {
    const [inserted] = await db.insert(activityTable).values(body).$returningId();
    return {
      ...body,
      activityId: inserted.activityId,
      id: inserted.activityId
    };
  }

  /* 更新 */
  async update(body: Partial<Activity> & { activityId?: number; id?: number; content_blocks?: string; content_html?: string }) {
    const activityId = Number(body.activityId || body.id);
    if (!activityId) {
      throw createError({ statusCode: 400, statusMessage: '缺少活动ID' });
    }

    const updateData = this.normalizeUpdateData(body);
    await db.update(activityTable).set(updateData).where(eq(activityTable.activityId, activityId));
  }

  private normalizeUpdateData(body: Partial<Activity> & { id?: number; content_blocks?: string; content_html?: string }) {
    const { id, activityId, content_blocks, content_html, ...updateData } = body;

    return {
      ...updateData,
      ...(content_blocks !== undefined ? { contentBlocks: content_blocks } : {}),
      ...(content_html !== undefined ? { contentHtml: content_html } : {})
    };
  }

  /* 分页查询 */
  async pageList(params?: Partial<Activity & { keyword: string } & queryParams>) {
    const { pageNum = 1, pageSize = 10, keyword, isHeadline, status } = params || {};
    const offset = (pageNum - 1) * pageSize;
    const whereList = [];

    if (keyword) {
      whereList.push(like(activityTable.name, `%${keyword}%`));
    }

    if (isHeadline === '0' || isHeadline === '1') {
      whereList.push(eq(activityTable.isHeadline, isHeadline));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(activityTable.status, status));
    }

    const where = whereList.length > 0 ? and(...whereList) : undefined;

    const rowsQuery = db.query.activityTable.findMany({
      extras: {
        id: sql`${activityTable.activityId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: (activityTable, { asc }) => [
        desc(activityTable.isHeadline),
        asc(activityTable.sort),
        desc(activityTable.updateTime),
        desc(activityTable.activityId)
      ]
    });

    const totalQuery = db.$count(activityTable, where);

    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows,
      total
    };
  }

  /* 根据ID查询 */
  async getById(activityId: number) {
    const result = await db.query.activityTable.findFirst({
      where: eq(activityTable.activityId, activityId)
    });
    return result;
  }

  /* 删除 */
  async delete(activityIds: string[]) {
    await db.delete(activityTable).where(
      inArray(
        activityTable.activityId,
        activityIds.map(id => Number(id))
      )
    );
  }
}
