import { and, desc, eq, like, sql } from 'drizzle-orm';
import { Paper, NewPaper, paperTable } from '~~/server/db/schema/admin/paper';
import { paperKeywordTable } from '~~/server/db/schema/admin/paperKeyword';
import { queryParams } from '~~/server/db/query.helper';
import {
  aggregateKeywordWeights,
  buildPaperKeywordWriteModels,
  resolvePaperKeywords,
  type PaperKeywordLike
} from './wordCloud.helpers';
import { aggregateYearlyPaperCounts } from './paperStatistics.helpers';

type PaperKeywordUpdateBody = {
  keywords?: PaperKeywordLike[];
};

type PaperPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    publishYear: number | string;
    isFeatured: string;
    status: string;
  }
>;

type PaperMutationBody = Partial<
  NewPaper & {
    id?: number;
    paperId?: number;
    publishYear?: number | string | null;
    isFeatured?: string;
  }
>;

export class PaperServices {
  async list() {
    const rows = await db
      .select({
        id: sql<number>`${paperTable.paperId}`.as('id'),
        paperId: paperTable.paperId,
        title: paperTable.title
      })
      .from(paperTable)
      .where(eq(paperTable.delFlag, '0'))
      .orderBy(desc(paperTable.updateTime), desc(paperTable.paperId));

    return { rows };
  }

  async getById(paperId: number) {
    const paper = await this.findPaperById(paperId);

    return {
      id: paper.paperId,
      paperId: paper.paperId,
      title: paper.title,
      abstract: paper.abstract || '',
      keywords: paper.keywords || '',
      publishYear: paper.publishYear,
      isFeatured: paper.isFeatured || '0',
      status: paper.status
    };
  }

  async pageList(params?: PaperPageParams) {
    const { pageNum = 1, pageSize = 10, title, publishYear, isFeatured, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(paperTable.delFlag, '0')];

    if (title) {
      whereList.push(like(paperTable.title, `%${title}%`));
    }

    if (publishYear !== undefined && publishYear !== null && String(publishYear).trim()) {
      whereList.push(eq(paperTable.publishYear, Number(publishYear)));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(paperTable.status, status));
    }

    if (isFeatured === '0' || isFeatured === '1') {
      whereList.push(eq(paperTable.isFeatured, isFeatured));
    }

    const where = and(...whereList);

    const rowsQuery = db.query.paperTable.findMany({
      extras: {
        id: sql<number>`${paperTable.paperId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: (paperTable, { desc }) => [
        desc(paperTable.publishYear),
        desc(paperTable.updateTime),
        desc(paperTable.paperId)
      ]
    });

    const totalQuery = db.$count(paperTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapPaperEntity(row)),
      total
    };
  }

  async add(body: PaperMutationBody, userName = 'system') {
    const insertPayload = this.normalizePaperMutationBody(body, userName);
    const [inserted] = await db.insert(paperTable).values(insertPayload).$returningId();
    return this.getById(inserted.paperId);
  }

  async update(body: PaperMutationBody, userName = 'system') {
    const paperId = Number(body.paperId || body.id);
    if (!paperId) {
      throw createError({ statusCode: 400, message: '缺少论文ID' });
    }

    await this.findPaperById(paperId);

    const updatePayload = this.normalizePaperMutationBody(body, userName, true);
    await db.update(paperTable).set(updatePayload).where(eq(paperTable.paperId, paperId));

    return this.getById(paperId);
  }

  async delete(paperId: number, userName = 'system') {
    await this.findPaperById(paperId);
    await db.update(paperTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(paperTable.paperId, paperId));
  }

  async updateFeatured(paperId: number, isFeatured: string, userName = 'system') {
    await this.findPaperById(paperId);
    await db.update(paperTable).set({
      isFeatured: isFeatured === '1' ? '1' : '0',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(paperTable.paperId, paperId));

    return this.getById(paperId);
  }

  async getPaperKeywords(paperId: number) {
    const paper = await this.findPaperById(paperId);
    const storedKeywords = await db
      .select({
        paperKeywordId: paperKeywordTable.paperKeywordId,
        keyword: paperKeywordTable.keyword,
        weight: paperKeywordTable.weight,
        source: paperKeywordTable.source
      })
      .from(paperKeywordTable)
      .where(and(eq(paperKeywordTable.paperId, paperId), eq(paperKeywordTable.delFlag, '0')))
      .orderBy(desc(paperKeywordTable.weight), paperKeywordTable.keyword);

    return {
      paperId: paper.paperId,
      paperTitle: paper.title,
      abstract: paper.abstract || '',
      keywords: resolvePaperKeywords(storedKeywords, paper.keywords)
    };
  }

  async updatePaperKeywords(paperId: number, body: PaperKeywordUpdateBody, userName = 'system') {
    await this.findPaperById(paperId);
    const keywordRows = Array.isArray(body?.keywords) ? body.keywords : [];
    const insertRows = buildPaperKeywordWriteModels(paperId, keywordRows, userName);

    await db.transaction(async tx => {
      await tx.delete(paperKeywordTable).where(eq(paperKeywordTable.paperId, paperId));

      if (insertRows.length > 0) {
        await tx.insert(paperKeywordTable).values(insertRows);
      }
    });
  }

  async getGlobalKeywordCloud() {
    const rows = await db
      .select({
        keyword: paperKeywordTable.keyword,
        weight: paperKeywordTable.weight
      })
      .from(paperKeywordTable)
      .where(eq(paperKeywordTable.delFlag, '0'));

    return {
      keywords: aggregateKeywordWeights(rows)
    };
  }

  async getYearlyCountStatistics() {
    const rows = await db.query.paperTable.findMany({
      columns: {
        publishYear: true,
        delFlag: true
      }
    });

    return {
      list: aggregateYearlyPaperCounts(rows)
    };
  }

  private async findPaperById(paperId: number): Promise<Paper> {
    if (!paperId) {
      throw createError({ statusCode: 400, message: '缺少论文ID' });
    }

    const paper = await db.query.paperTable.findFirst({
      where: and(eq(paperTable.paperId, paperId), eq(paperTable.delFlag, '0'))
    });

    if (!paper) {
      throw createError({ statusCode: 404, message: '论文不存在' });
    }

    return paper;
  }

  private normalizePaperMutationBody(body: PaperMutationBody, userName: string, isUpdate = false) {
    const payload: PaperMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      abstract: body.abstract || '',
      keywords: body.keywords || '',
      publishYear: this.normalizePublishYear(body.publishYear),
      isFeatured: body.isFeatured === '1' ? '1' : '0',
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
      throw createError({ statusCode: 400, message: '论文标题不能为空' });
    }

    return payload;
  }

  private normalizePublishYear(value?: number | string | null) {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const year = Number(value);
    if (!Number.isInteger(year) || year < 0) {
      throw createError({ statusCode: 400, message: '发表年份格式不正确' });
    }

    return year;
  }

  private mapPaperEntity(row: Paper & { id?: number }) {
    return {
      id: row.id || row.paperId,
      paperId: row.paperId,
      title: row.title,
      abstract: row.abstract || '',
      keywords: row.keywords || '',
      publishYear: row.publishYear,
      isFeatured: row.isFeatured || '0',
      status: row.status,
      updateTime: row.updateTime
    };
  }
}
