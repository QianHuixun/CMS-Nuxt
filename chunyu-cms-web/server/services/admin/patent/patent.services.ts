import { and, desc, eq, like, sql } from 'drizzle-orm';
import { NewPatent, Patent, patentTable } from '~~/server/db/schema/admin/patent';
import { queryParams } from '~~/server/db/query.helper';

type PatentPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    applyYear: number | string;
    status: string;
  }
>;

type PatentMutationBody = Partial<
  NewPatent & {
    id?: number;
    patentId?: number;
    applyYear?: number | string | null;
  }
>;

export class PatentServices {
  async list() {
    const rows = await db
      .select({
        id: sql<number>`${patentTable.patentId}`.as('id'),
        patentId: patentTable.patentId,
        title: patentTable.title
      })
      .from(patentTable)
      .where(eq(patentTable.delFlag, '0'))
      .orderBy(desc(patentTable.updateTime), desc(patentTable.patentId));

    return { rows };
  }

  async pageList(params?: PatentPageParams) {
    const { pageNum = 1, pageSize = 10, title, applyYear, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(patentTable.delFlag, '0')];

    if (title) {
      whereList.push(like(patentTable.title, `%${title}%`));
    }

    if (applyYear !== undefined && applyYear !== null && String(applyYear).trim()) {
      whereList.push(eq(patentTable.applyYear, Number(applyYear)));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(patentTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.patentTable.findMany({
      extras: {
        id: sql<number>`${patentTable.patentId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: (patentTable, { desc }) => [
        desc(patentTable.applyYear),
        desc(patentTable.updateTime),
        desc(patentTable.patentId)
      ]
    });
    const totalQuery = db.$count(patentTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapPatentEntity(row)),
      total
    };
  }

  async getById(patentId: number) {
    const patent = await this.findPatentById(patentId);

    return this.mapPatentEntity({
      ...patent,
      id: patent.patentId
    });
  }

  async add(body: PatentMutationBody, userName = 'system') {
    const insertPayload = this.normalizePatentMutationBody(body, userName);
    const [inserted] = await db.insert(patentTable).values(insertPayload).$returningId();
    return this.getById(inserted.patentId);
  }

  async update(body: PatentMutationBody, userName = 'system') {
    const patentId = Number(body.patentId || body.id);
    if (!patentId) {
      throw createError({ statusCode: 400, message: '缺少专利ID' });
    }

    await this.findPatentById(patentId);
    const updatePayload = this.normalizePatentMutationBody(body, userName, true);
    await db.update(patentTable).set(updatePayload).where(eq(patentTable.patentId, patentId));
    return this.getById(patentId);
  }

  async delete(patentId: number, userName = 'system') {
    await this.findPatentById(patentId);
    await db.update(patentTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(patentTable.patentId, patentId));
  }

  private async findPatentById(patentId: number): Promise<Patent> {
    if (!patentId) {
      throw createError({ statusCode: 400, message: '缺少专利ID' });
    }

    const patent = await db.query.patentTable.findFirst({
      where: and(eq(patentTable.patentId, patentId), eq(patentTable.delFlag, '0'))
    });

    if (!patent) {
      throw createError({ statusCode: 404, message: '专利不存在' });
    }

    return patent;
  }

  private normalizePatentMutationBody(body: PatentMutationBody, userName: string, isUpdate = false) {
    const payload: PatentMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      patentNo: typeof body.patentNo === 'string' ? body.patentNo.trim() : '',
      applicant: typeof body.applicant === 'string' ? body.applicant.trim() : '',
      applyYear: this.normalizeYear(body.applyYear, '申请年份格式不正确'),
      abstract: body.abstract || '',
      operationVideoUrl: body.operationVideoUrl || '',
      videoCoverUrl: body.videoCoverUrl || '',
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
      throw createError({ statusCode: 400, message: '专利名称不能为空' });
    }

    return payload;
  }

  private normalizeYear(value?: number | string | null, message = '年份格式不正确') {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const year = Number(value);
    if (!Number.isInteger(year) || year < 0) {
      throw createError({ statusCode: 400, message });
    }

    return year;
  }

  private mapPatentEntity(row: Patent & { id?: number }) {
    return {
      id: row.id || row.patentId,
      patentId: row.patentId,
      title: row.title,
      patentNo: row.patentNo || '',
      applicant: row.applicant || '',
      applyYear: row.applyYear,
      abstract: row.abstract || '',
      operationVideoUrl: row.operationVideoUrl || '',
      videoCoverUrl: row.videoCoverUrl || '',
      status: row.status,
      updateTime: row.updateTime
    };
  }
}
