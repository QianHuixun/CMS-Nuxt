import { and, desc, eq, inArray, like, sql } from 'drizzle-orm';
import { queryParams } from '~~/server/db/query.helper';
import { paperTable } from '~~/server/db/schema/admin/paper';
import { patentTable } from '~~/server/db/schema/admin/patent';
import { Talent, NewTalent, talentTable } from '~~/server/db/schema/admin/talent';
import {
  NewTalentAchievementRelation,
  talentAchievementRelationTable
} from '~~/server/db/schema/admin/talentAchievementRelation';
import { topicTable } from '~~/server/db/schema/admin/topic';

type TalentPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    name: string;
    organization: string;
    researchDirection: string;
    status: string;
  }
>;

type TalentMutationBody = Partial<
  NewTalent & {
    id?: number;
    talentId?: number;
    researchDirection?: string;
    resume?: string;
    photoUrl?: string;
    paperIds?: number[];
    patentIds?: number[];
    topicIds?: number[];
  }
>;

type AchievementOption = {
  id: number;
  title: string;
};

export class TalentServices {
  async pageList(params?: TalentPageParams) {
    const { pageNum = 1, pageSize = 10, name, organization, researchDirection, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(talentTable.delFlag, '0')];

    if (name) {
      whereList.push(like(talentTable.name, `%${name}%`));
    }

    if (organization) {
      whereList.push(like(talentTable.organization, `%${organization}%`));
    }

    if (researchDirection) {
      whereList.push(like(talentTable.researchDirection, `%${researchDirection}%`));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(talentTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.talentTable.findMany({
      extras: {
        id: sql<number>`${talentTable.talentId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: (table, { desc }) => [desc(table.updateTime), desc(table.talentId)]
    });
    const totalQuery = db.$count(talentTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);
    const relationStats = await this.getRelationStats(rows.map(row => row.talentId));

    return {
      rows: rows.map(row => ({
        ...this.mapTalentEntity(row),
        paperCount: relationStats.get(`${row.talentId}:paper`) || 0,
        patentCount: relationStats.get(`${row.talentId}:patent`) || 0,
        topicCount: relationStats.get(`${row.talentId}:topic`) || 0
      })),
      total
    };
  }

  async getById(talentId: number) {
    const talent = await this.findTalentById(talentId);
    return this.buildTalentDetail(talent);
  }

  async add(body: TalentMutationBody, userName = 'system') {
    const insertedTalentId = await db.transaction(async tx => {
      const payload = this.normalizeTalentMutationBody(body, userName);
      const [inserted] = await tx.insert(talentTable).values(payload).$returningId();
      await this.replaceRelations(tx, inserted.talentId, body, userName);
      return inserted.talentId;
    });

    return this.getById(insertedTalentId);
  }

  async update(body: TalentMutationBody, userName = 'system') {
    const talentId = Number(body.talentId || body.id);
    if (!talentId) {
      throw createError({ statusCode: 400, message: '缺少人才ID' });
    }

    await this.findTalentById(talentId);

    await db.transaction(async tx => {
      const payload = this.normalizeTalentMutationBody(body, userName, true);
      await tx.update(talentTable).set(payload).where(eq(talentTable.talentId, talentId));
      await this.replaceRelations(tx, talentId, body, userName);
    });

    return this.getById(talentId);
  }

  async delete(talentId: number, userName = 'system') {
    await this.findTalentById(talentId);
    await db.transaction(async tx => {
      await tx.update(talentTable).set({
        delFlag: '1',
        updateBy: userName,
        updateTime: new Date()
      }).where(eq(talentTable.talentId, talentId));

      await tx.update(talentAchievementRelationTable).set({
        delFlag: '1',
        updateBy: userName,
        updateTime: new Date()
      }).where(eq(talentAchievementRelationTable.talentId, talentId));
    });
  }

  private async findTalentById(talentId: number): Promise<Talent> {
    if (!talentId) {
      throw createError({ statusCode: 400, message: '缺少人才ID' });
    }

    const talent = await db.query.talentTable.findFirst({
      where: and(eq(talentTable.talentId, talentId), eq(talentTable.delFlag, '0'))
    });

    if (!talent) {
      throw createError({ statusCode: 404, message: '人才不存在' });
    }

    return talent;
  }

  private normalizeTalentMutationBody(body: TalentMutationBody, userName: string, isUpdate = false) {
    const payload: TalentMutationBody = {
      name: typeof body.name === 'string' ? body.name.trim() : '',
      title: typeof body.title === 'string' ? body.title.trim() : '',
      organization: typeof body.organization === 'string' ? body.organization.trim() : '',
      researchDirection: typeof body.researchDirection === 'string' ? body.researchDirection.trim() : '',
      resume: typeof body.resume === 'string' ? body.resume : '',
      photoUrl: typeof body.photoUrl === 'string' ? body.photoUrl : '',
      status: body.status === '1' ? '1' : '0',
      updateBy: userName,
      updateTime: new Date()
    };

    if (!isUpdate) {
      payload.createBy = userName;
      payload.createTime = new Date();
      payload.delFlag = '0';
    }

    if (!payload.name) {
      throw createError({ statusCode: 400, message: '姓名不能为空' });
    }

    return payload;
  }

  private mapTalentEntity(row: Talent & { id?: number }) {
    return {
      id: row.id || row.talentId,
      talentId: row.talentId,
      name: row.name,
      title: row.title || '',
      organization: row.organization || '',
      researchDirection: row.researchDirection || '',
      resume: row.resume || '',
      photoUrl: row.photoUrl || '',
      status: row.status,
      updateTime: row.updateTime
    };
  }

  private async buildTalentDetail(talent: Talent) {
    const relations = await db
      .select({
        relationId: talentAchievementRelationTable.talentAchievementRelationId,
        achievementType: talentAchievementRelationTable.achievementType,
        achievementId: talentAchievementRelationTable.achievementId,
        sort: talentAchievementRelationTable.sort,
        status: talentAchievementRelationTable.status
      })
      .from(talentAchievementRelationTable)
      .where(and(eq(talentAchievementRelationTable.talentId, talent.talentId), eq(talentAchievementRelationTable.delFlag, '0')))
      .orderBy(talentAchievementRelationTable.sort, talentAchievementRelationTable.talentAchievementRelationId);

    const paperIds = relations.filter(item => item.achievementType === 'paper').map(item => item.achievementId);
    const patentIds = relations.filter(item => item.achievementType === 'patent').map(item => item.achievementId);
    const topicIds = relations.filter(item => item.achievementType === 'topic').map(item => item.achievementId);

    const [papers, patents, topics] = await Promise.all([
      this.loadPaperOptions(paperIds),
      this.loadPatentOptions(patentIds),
      this.loadTopicOptions(topicIds)
    ]);

    return {
      ...this.mapTalentEntity({
        ...talent,
        id: talent.talentId
      }),
      paperIds: papers.map(item => item.id),
      patentIds: patents.map(item => item.id),
      topicIds: topics.map(item => item.id),
      papers,
      patents,
      topics
    };
  }

  private async replaceRelations(
    tx: typeof db,
    talentId: number,
    body: TalentMutationBody,
    userName: string
  ) {
    await tx.delete(talentAchievementRelationTable).where(eq(talentAchievementRelationTable.talentId, talentId));
    const insertRows = await this.buildAchievementRelations(talentId, body, userName);

    if (insertRows.length > 0) {
      await tx.insert(talentAchievementRelationTable).values(insertRows);
    }
  }

  private async buildAchievementRelations(talentId: number, body: TalentMutationBody, userName: string) {
    const paperIds = this.normalizeIdList(body.paperIds);
    const patentIds = this.normalizeIdList(body.patentIds);
    const topicIds = this.normalizeIdList(body.topicIds);

    const [validPaperIds, validPatentIds, validTopicIds] = await Promise.all([
      this.loadValidIds('paper', paperIds),
      this.loadValidIds('patent', patentIds),
      this.loadValidIds('topic', topicIds)
    ]);

    let sort = 1;
    const rows: NewTalentAchievementRelation[] = [];

    validPaperIds.forEach(id => {
      rows.push(this.createRelationRow(talentId, 'paper', id, sort++, userName));
    });
    validPatentIds.forEach(id => {
      rows.push(this.createRelationRow(talentId, 'patent', id, sort++, userName));
    });
    validTopicIds.forEach(id => {
      rows.push(this.createRelationRow(talentId, 'topic', id, sort++, userName));
    });

    return rows;
  }

  private createRelationRow(
    talentId: number,
    achievementType: 'paper' | 'patent' | 'topic',
    achievementId: number,
    sort: number,
    userName: string
  ): NewTalentAchievementRelation {
    return {
      talentId,
      achievementType,
      achievementId,
      sort,
      status: '1',
      delFlag: '0',
      createBy: userName,
      createTime: new Date(),
      updateBy: userName,
      updateTime: new Date()
    };
  }

  private normalizeIdList(values?: number[]) {
    const result = Array.isArray(values) ? values : [];
    return Array.from(new Set(result.map(item => Number(item)).filter(item => Number.isInteger(item) && item > 0)));
  }

  private async loadValidIds(type: 'paper' | 'patent' | 'topic', ids: number[]) {
    if (!ids.length) {
      return [];
    }

    if (type === 'paper') {
      const rows = await db
        .select({ id: paperTable.paperId })
        .from(paperTable)
        .where(and(inArray(paperTable.paperId, ids), eq(paperTable.delFlag, '0')));
      return ids.filter(id => rows.some(row => row.id === id));
    }

    if (type === 'patent') {
      const rows = await db
        .select({ id: patentTable.patentId })
        .from(patentTable)
        .where(and(inArray(patentTable.patentId, ids), eq(patentTable.delFlag, '0')));
      return ids.filter(id => rows.some(row => row.id === id));
    }

    const rows = await db
      .select({ id: topicTable.topicId })
      .from(topicTable)
      .where(and(inArray(topicTable.topicId, ids), eq(topicTable.delFlag, '0')));
    return ids.filter(id => rows.some(row => row.id === id));
  }

  private async loadPaperOptions(ids: number[]): Promise<AchievementOption[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await db
      .select({ id: paperTable.paperId, title: paperTable.title })
      .from(paperTable)
      .where(and(inArray(paperTable.paperId, ids), eq(paperTable.delFlag, '0')))
      .orderBy(desc(paperTable.updateTime), desc(paperTable.paperId));
    return ids.map(id => rows.find(row => row.id === id)).filter(Boolean) as AchievementOption[];
  }

  private async loadPatentOptions(ids: number[]): Promise<AchievementOption[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await db
      .select({ id: patentTable.patentId, title: patentTable.title })
      .from(patentTable)
      .where(and(inArray(patentTable.patentId, ids), eq(patentTable.delFlag, '0')))
      .orderBy(desc(patentTable.updateTime), desc(patentTable.patentId));
    return ids.map(id => rows.find(row => row.id === id)).filter(Boolean) as AchievementOption[];
  }

  private async loadTopicOptions(ids: number[]): Promise<AchievementOption[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await db
      .select({ id: topicTable.topicId, title: topicTable.title })
      .from(topicTable)
      .where(and(inArray(topicTable.topicId, ids), eq(topicTable.delFlag, '0')))
      .orderBy(desc(topicTable.updateTime), desc(topicTable.topicId));
    return ids.map(id => rows.find(row => row.id === id)).filter(Boolean) as AchievementOption[];
  }

  private async getRelationStats(talentIds: number[]) {
    const validIds = talentIds.filter(Boolean);
    if (!validIds.length) {
      return new Map<string, number>();
    }

    const rows = await db
      .select({
        talentId: talentAchievementRelationTable.talentId,
        achievementType: talentAchievementRelationTable.achievementType,
        count: sql<number>`count(*)`.as('count')
      })
      .from(talentAchievementRelationTable)
      .where(and(inArray(talentAchievementRelationTable.talentId, validIds), eq(talentAchievementRelationTable.delFlag, '0')))
      .groupBy(talentAchievementRelationTable.talentId, talentAchievementRelationTable.achievementType);

    return new Map(rows.map(row => [`${row.talentId}:${row.achievementType}`, Number(row.count || 0)]));
  }
}
