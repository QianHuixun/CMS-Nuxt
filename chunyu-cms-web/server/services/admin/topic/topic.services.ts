import { and, desc, eq, like, sql } from 'drizzle-orm';
import { NewTopic, Topic, topicTable } from '~~/server/db/schema/admin/topic';
import { queryParams } from '~~/server/db/query.helper';

type TopicPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    projectYear: number | string;
    status: string;
  }
>;

type TopicMutationBody = Partial<
  NewTopic & {
    id?: number;
    topicId?: number;
    projectId?: number;
    projectYear?: number | string | null;
  }
>;

export class TopicServices {
  async list() {
    const rows = await db
      .select({
        id: sql<number>`${topicTable.topicId}`.as('id'),
        projectId: topicTable.topicId,
        topicId: topicTable.topicId,
        title: topicTable.title
      })
      .from(topicTable)
      .where(eq(topicTable.delFlag, '0'))
      .orderBy(desc(topicTable.updateTime), desc(topicTable.topicId));

    return { rows };
  }

  async pageList(params?: TopicPageParams) {
    const { pageNum = 1, pageSize = 10, title, projectYear, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(topicTable.delFlag, '0')];

    if (title) {
      whereList.push(like(topicTable.title, `%${title}%`));
    }

    if (projectYear !== undefined && projectYear !== null && String(projectYear).trim()) {
      whereList.push(eq(topicTable.projectYear, Number(projectYear)));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(topicTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.topicTable.findMany({
      extras: {
        id: sql<number>`${topicTable.topicId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: (topicTable, { desc }) => [
        desc(topicTable.projectYear),
        desc(topicTable.updateTime),
        desc(topicTable.topicId)
      ]
    });
    const totalQuery = db.$count(topicTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapTopicEntity(row)),
      total
    };
  }

  async getById(topicId: number) {
    const topic = await this.findTopicById(topicId);
    return this.mapTopicEntity({
      ...topic,
      id: topic.topicId
    });
  }

  async add(body: TopicMutationBody, userName = 'system') {
    const insertPayload = this.normalizeTopicMutationBody(body, userName);
    const [inserted] = await db.insert(topicTable).values(insertPayload).$returningId();
    return this.getById(inserted.topicId);
  }

  async update(body: TopicMutationBody, userName = 'system') {
    const topicId = Number(body.projectId || body.topicId || body.id);
    if (!topicId) {
      throw createError({ statusCode: 400, message: '缺少课题ID' });
    }

    await this.findTopicById(topicId);
    const updatePayload = this.normalizeTopicMutationBody(body, userName, true);
    await db.update(topicTable).set(updatePayload).where(eq(topicTable.topicId, topicId));
    return this.getById(topicId);
  }

  async delete(topicId: number, userName = 'system') {
    await this.findTopicById(topicId);
    await db.update(topicTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(topicTable.topicId, topicId));
  }

  private async findTopicById(topicId: number): Promise<Topic> {
    if (!topicId) {
      throw createError({ statusCode: 400, message: '缺少课题ID' });
    }

    const topic = await db.query.topicTable.findFirst({
      where: and(eq(topicTable.topicId, topicId), eq(topicTable.delFlag, '0'))
    });

    if (!topic) {
      throw createError({ statusCode: 404, message: '课题不存在' });
    }

    return topic;
  }

  private normalizeTopicMutationBody(body: TopicMutationBody, userName: string, isUpdate = false) {
    const payload: TopicMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      topicNo: typeof body.topicNo === 'string' ? body.topicNo.trim() : '',
      leader: typeof body.leader === 'string' ? body.leader.trim() : '',
      projectYear: this.normalizeYear(body.projectYear),
      source: typeof body.source === 'string' ? body.source.trim() : '',
      abstract: body.abstract || '',
      status: body.status === '1' ? '1' : '0',
      updateBy: userName,
      updateTime: new Date()
    };

    if (!isUpdate) {
      payload.createBy = userName;
      payload.createTime = new Date();
      payload.delFlag = '0';
    }

    if (!payload.title) {
      throw createError({ statusCode: 400, message: '课题名称不能为空' });
    }

    return payload;
  }

  private normalizeYear(value?: number | string | null) {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const year = Number(value);
    if (!Number.isInteger(year) || year < 0) {
      throw createError({ statusCode: 400, message: '立项年份格式不正确' });
    }

    return year;
  }

  private mapTopicEntity(row: Topic & { id?: number }) {
    return {
      id: row.id || row.topicId,
      projectId: row.topicId,
      topicId: row.topicId,
      title: row.title,
      topicNo: row.topicNo || '',
      leader: row.leader || '',
      projectYear: row.projectYear,
      source: row.source || '',
      abstract: row.abstract || '',
      status: row.status,
      updateTime: row.updateTime
    };
  }
}
