import { and, asc, desc, eq, inArray, like, or, sql } from 'drizzle-orm';
import { NewTopic, Topic, topicTable } from '~~/server/db/schema/talent/topic';
import { talentTopicTable } from '~~/server/db/schema/talent/talentTopic';
import { queryParams } from '~~/server/db/query.helper';

type TopicPayload = Partial<Topic> & {
  id?: number | string;
  topicId?: number | string;
  topicNo?: string;
  researchStatus?: string;
  startDate?: string | Date;
  endDate?: string | Date;
};

type TopicListParams = Partial<Topic & {
  id: number;
  keyword: string;
  topicNo: string;
  researchStatus: string;
  year: number | string;
  pageSize: number;
} & queryParams>;

const levelValues = ['national', 'provincial', 'municipal', 'school'];
const researchStatusValues = ['preparing', 'ongoing', 'completed'];

export class TopicSpaceTimeServices {
  async add(payload: TopicPayload) {
    const data = await this.normalizeTopicPayload(payload);
    const [inserted] = await db.insert(topicTable).values(data).$returningId();

    return {
      ...data,
      topicId: inserted.topicId,
      id: inserted.topicId
    };
  }

  async update(payload: TopicPayload) {
    const topicId = Number(payload.topicId || payload.id);
    if (!topicId) {
      throw createError({ statusCode: 400, statusMessage: '缺少课题ID' });
    }

    const data = await this.normalizeTopicPayload(payload, topicId);
    const existed = await this.getExistingTopic(topicId);
    if (!existed) {
      throw createError({ statusCode: 404, statusMessage: '课题不存在' });
    }

    await db
      .update(topicTable)
      .set({
        ...data,
        updateTime: new Date()
      })
      .where(and(eq(topicTable.topicId, topicId), eq(topicTable.delFlag, '0')));
  }

  async pageList(params?: TopicListParams) {
    const {
      pageNum = 1,
      pageSize = 10,
      keyword,
      title,
      topicNo,
      level,
      researchStatus,
      leader,
      year,
      status
    } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(topicTable.delFlag, '0')];

    const searchTitle = String(title || keyword || '').trim();
    if (searchTitle) {
      whereList.push(like(topicTable.title, `%${searchTitle}%`));
    }

    const searchTopicNo = String(topicNo || '').trim();
    if (searchTopicNo) {
      whereList.push(like(topicTable.topicNo, `%${searchTopicNo}%`));
    }

    if (level) {
      whereList.push(eq(topicTable.level, String(level)));
    }

    if (researchStatus) {
      whereList.push(eq(topicTable.researchStatus, String(researchStatus)));
    }

    const searchLeader = String(leader || '').trim();
    if (searchLeader) {
      whereList.push(like(topicTable.leader, `%${searchLeader}%`));
    }

    const numericYear = Number(year);
    if (Number.isInteger(numericYear) && numericYear > 0) {
      whereList.push(
        or(
          eq(topicTable.startYear, numericYear),
          eq(topicTable.endYear, numericYear),
          sql`(${topicTable.startYear} <= ${numericYear} and ${topicTable.endYear} >= ${numericYear})`
        ) as any
      );
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(topicTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.topicTable.findMany({
      extras: {
        id: sql`${topicTable.topicId}`.as('id'),
        talentCount: db.$count(talentTopicTable, sql`${talentTopicTable.topicId} = ${topicTable.topicId}`).as('talentCount')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: [asc(topicTable.sort), desc(topicTable.updateTime), desc(topicTable.topicId)]
    });
    const totalQuery = db.$count(topicTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows,
      total
    };
  }

  async getById(id: number) {
    const topic = await db.query.topicTable.findFirst({
      extras: {
        id: sql`${topicTable.topicId}`.as('id'),
        talentCount: db.$count(talentTopicTable, sql`${talentTopicTable.topicId} = ${topicTable.topicId}`).as('talentCount')
      },
      where: and(eq(topicTable.topicId, id), eq(topicTable.delFlag, '0'))
    });

    if (!topic) {
      throw createError({ statusCode: 404, statusMessage: '课题不存在' });
    }

    return topic;
  }

  async delete(ids: string[]) {
    const topicIds = this.normalizeIds(ids);
    if (!topicIds.length) {
      throw createError({ statusCode: 400, statusMessage: '缺少课题ID' });
    }

    await db
      .update(topicTable)
      .set({
        delFlag: '1',
        updateTime: new Date()
      })
      .where(inArray(topicTable.topicId, topicIds));
  }

  async changeStatus(ids: Array<number | string>, status: string) {
    const topicIds = this.normalizeIds(ids);
    if (!topicIds.length) {
      throw createError({ statusCode: 400, statusMessage: '缺少课题ID' });
    }
    if (status !== '0' && status !== '1') {
      throw createError({ statusCode: 400, statusMessage: '状态值不正确' });
    }

    await db
      .update(topicTable)
      .set({
        status,
        updateTime: new Date()
      })
      .where(and(inArray(topicTable.topicId, topicIds), eq(topicTable.delFlag, '0')));
  }

  async stats() {
    const where = eq(topicTable.delFlag, '0');
    const today = this.formatDate(new Date());
    const next30Days = this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    const [total, ongoing, completed, dueSoon] = await Promise.all([
      db.$count(topicTable, where),
      db.$count(topicTable, and(where, eq(topicTable.researchStatus, 'ongoing'))),
      db.$count(topicTable, and(where, eq(topicTable.researchStatus, 'completed'))),
      db.$count(
        topicTable,
        and(
          where,
          eq(topicTable.researchStatus, 'ongoing'),
          sql`${topicTable.endDate} >= ${today}`,
          sql`${topicTable.endDate} <= ${next30Days}`
        )
      )
    ]);

    return {
      total,
      ongoing,
      completed,
      dueSoon
    };
  }

  async optionList(params?: { keyword?: string; limit?: number }) {
    const keyword = String(params?.keyword || '').trim();
    const limit = Number(params?.limit || 20);
    const whereList = [eq(topicTable.delFlag, '0'), eq(topicTable.status, '0')];

    if (keyword) {
      whereList.push(or(like(topicTable.title, `%${keyword}%`), like(topicTable.topicNo, `%${keyword}%`)) as any);
    }

    const rows = await db.query.topicTable.findMany({
      columns: {
        topicId: true,
        title: true,
        topicNo: true,
        leader: true
      },
      extras: {
        id: sql`${topicTable.topicId}`.as('id'),
        name: sql`${topicTable.title}`.as('name')
      },
      where: and(...whereList),
      limit,
      orderBy: [asc(topicTable.sort), desc(topicTable.updateTime), desc(topicTable.topicId)]
    });

    return rows;
  }

  private async normalizeTopicPayload(payload: TopicPayload, currentTopicId?: number): Promise<NewTopic> {
    const title = String(payload.title || '').trim();
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: '课题名称不能为空' });
    }

    const topicNo = String(payload.topicNo || '').trim();
    if (topicNo) {
      await this.assertUniqueTopicNo(topicNo, currentTopicId);
    }

    const startDate = this.normalizeDate(payload.startDate);
    const endDate = this.normalizeDate(payload.endDate);
    if (startDate && endDate && endDate < startDate) {
      throw createError({ statusCode: 400, statusMessage: '结束日期不能早于开始日期' });
    }

    const level = String(payload.level || '').trim();
    const researchStatus = String(payload.researchStatus || 'preparing').trim();

    return {
      title,
      topicNo,
      level: levelValues.includes(level) ? level : '',
      source: payload.source || '',
      leader: payload.leader || '',
      researchStatus: researchStatusValues.includes(researchStatus) ? researchStatus : 'preparing',
      progress: this.normalizeProgress(payload.progress),
      startYear: startDate ? Number(startDate.slice(0, 4)) : undefined,
      endYear: endDate ? Number(endDate.slice(0, 4)) : undefined,
      startDate,
      endDate,
      summary: payload.summary || '',
      sort: Number(payload.sort || 0),
      status: payload.status === '1' ? '1' : '0',
      delFlag: '0',
      remark: payload.remark || ''
    };
  }

  private normalizeDate(value?: string | Date | null) {
    if (!value) return undefined;
    if (value instanceof Date) return this.formatDate(value);

    const text = String(value).trim();
    if (!text) return undefined;
    const dateText = text.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      throw createError({ statusCode: 400, statusMessage: '日期格式不正确' });
    }
    return dateText;
  }

  private formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private normalizeProgress(value: unknown) {
    const progress = Number(value || 0);
    if (!Number.isFinite(progress)) return 0;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }

  private normalizeIds(ids: Array<number | string> | string[]) {
    const flatIds = ids.flatMap(id => String(id).split(','));
    return Array.from(new Set(flatIds.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0)));
  }

  private async getExistingTopic(topicId: number) {
    return db.query.topicTable.findFirst({
      columns: { topicId: true },
      where: and(eq(topicTable.topicId, topicId), eq(topicTable.delFlag, '0'))
    });
  }

  private async assertUniqueTopicNo(topicNo: string, currentTopicId?: number) {
    const existed = await db.query.topicTable.findFirst({
      columns: { topicId: true },
      where: and(eq(topicTable.topicNo, topicNo), eq(topicTable.delFlag, '0'))
    });

    if (existed && existed.topicId !== currentTopicId) {
      throw createError({ statusCode: 400, statusMessage: '课题编号已存在' });
    }
  }
}
