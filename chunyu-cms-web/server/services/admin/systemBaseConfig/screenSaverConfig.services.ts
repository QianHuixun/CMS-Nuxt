import { and, asc, desc, eq, like, sql } from 'drizzle-orm';
import { queryParams } from '~~/server/db/query.helper';
import {
  NewScreenSaverConfig,
  ScreenSaverConfig,
  screenSaverConfigTable
} from '~~/server/db/schema/admin/screenSaverConfig';

type ScreenSaverConfigPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    mediaType: string;
    status: string;
  }
>;

type ScreenSaverConfigMutationBody = Partial<
  NewScreenSaverConfig & {
    id?: number;
    screensaverConfigId?: number;
    mediaType?: string;
    mediaUrl?: string;
    coverUrl?: string;
    triggerSeconds?: number;
  }
>;

export class ScreenSaverConfigServices {
  async pageList(params?: ScreenSaverConfigPageParams) {
    const { pageNum = 1, pageSize = 10, title, mediaType, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(screenSaverConfigTable.delFlag, '0')];

    if (title) {
      whereList.push(like(screenSaverConfigTable.title, `%${title}%`));
    }

    if (this.isValidMediaType(mediaType)) {
      whereList.push(eq(screenSaverConfigTable.mediaType, mediaType));
    }

    if (this.isValidStatus(status)) {
      whereList.push(eq(screenSaverConfigTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.screenSaverConfigTable.findMany({
      extras: {
        id: sql<number>`${screenSaverConfigTable.screensaverConfigId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: table => [asc(table.sort), desc(table.screensaverConfigId)]
    });
    const totalQuery = db.$count(screenSaverConfigTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows: rows.map(row => this.mapEntity(row)),
      total
    };
  }

  async publicList() {
    const rows = await db.query.screenSaverConfigTable.findMany({
      where: and(eq(screenSaverConfigTable.delFlag, '0'), eq(screenSaverConfigTable.status, 'active')),
      orderBy: table => [asc(table.sort), desc(table.screensaverConfigId)]
    });

    return {
      triggerSeconds: rows[0]?.triggerSeconds || 300,
      total: rows.length,
      list: rows.map(row => ({
        id: String(row.screensaverConfigId),
        title: row.title,
        mediaType: row.mediaType || 'image',
        mediaUrl: row.mediaUrl || '',
        coverUrl: row.coverUrl || '',
        triggerSeconds: row.triggerSeconds || 300,
        sort: row.sort || 0
      }))
    };
  }

  async getById(screensaverConfigId: number) {
    return this.mapEntity(await this.findById(screensaverConfigId));
  }

  async add(body: ScreenSaverConfigMutationBody, userName = 'system') {
    const payload = this.normalizeMutationBody(body, userName);
    const [inserted] = await db.insert(screenSaverConfigTable).values(payload).$returningId();
    return this.getById(inserted.screensaverConfigId);
  }

  async update(body: ScreenSaverConfigMutationBody, userName = 'system') {
    const screensaverConfigId = Number(body.screensaverConfigId || body.id);
    if (!screensaverConfigId) {
      throw createError({ statusCode: 400, message: '缺少屏保配置ID' });
    }

    await this.findById(screensaverConfigId);
    const payload = this.normalizeMutationBody(body, userName, true);
    await db
      .update(screenSaverConfigTable)
      .set(payload)
      .where(eq(screenSaverConfigTable.screensaverConfigId, screensaverConfigId));
    return this.getById(screensaverConfigId);
  }

  async delete(screensaverConfigId: number, userName = 'system') {
    await this.findById(screensaverConfigId);
    await db.update(screenSaverConfigTable).set({
      delFlag: '1',
      updateBy: userName,
      updateTime: new Date()
    }).where(eq(screenSaverConfigTable.screensaverConfigId, screensaverConfigId));
  }

  private async findById(screensaverConfigId: number): Promise<ScreenSaverConfig> {
    if (!screensaverConfigId) {
      throw createError({ statusCode: 400, message: '缺少屏保配置ID' });
    }

    const row = await db.query.screenSaverConfigTable.findFirst({
      where: and(
        eq(screenSaverConfigTable.screensaverConfigId, screensaverConfigId),
        eq(screenSaverConfigTable.delFlag, '0')
      )
    });

    if (!row) {
      throw createError({ statusCode: 404, message: '屏保配置不存在' });
    }

    return row;
  }

  private normalizeMutationBody(body: ScreenSaverConfigMutationBody, userName: string, isUpdate = false) {
    const payload: ScreenSaverConfigMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      mediaType: this.isValidMediaType(body.mediaType) ? body.mediaType : 'image',
      mediaUrl: typeof body.mediaUrl === 'string' ? body.mediaUrl : '',
      coverUrl: typeof body.coverUrl === 'string' ? body.coverUrl : '',
      triggerSeconds: this.normalizeTriggerSeconds(body.triggerSeconds),
      sort: Number.isFinite(Number(body.sort)) ? Number(body.sort) : 0,
      status: this.isValidStatus(body.status) ? body.status : 'active',
      remark: typeof body.remark === 'string' ? body.remark : '',
      updateBy: userName,
      updateTime: new Date()
    };

    if (!payload.title) {
      throw createError({ statusCode: 400, message: '配置名称不能为空' });
    }

    if (!payload.mediaUrl) {
      throw createError({ statusCode: 400, message: '请上传或填写屏保媒体' });
    }

    if (!isUpdate) {
      payload.createBy = userName;
      payload.createTime = new Date();
      payload.delFlag = '0';
    }

    return payload;
  }

  private normalizeTriggerSeconds(value?: number) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return 300;
    return Math.max(5, Math.floor(seconds));
  }

  private mapEntity(row: ScreenSaverConfig & { id?: number }) {
    return {
      id: row.id || row.screensaverConfigId,
      screensaverConfigId: row.screensaverConfigId,
      title: row.title,
      mediaType: row.mediaType || 'image',
      mediaUrl: row.mediaUrl || '',
      coverUrl: row.coverUrl || '',
      triggerSeconds: row.triggerSeconds || 300,
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

  private isValidMediaType(mediaType?: string): mediaType is 'image' | 'video' {
    return mediaType === 'image' || mediaType === 'video';
  }
}
