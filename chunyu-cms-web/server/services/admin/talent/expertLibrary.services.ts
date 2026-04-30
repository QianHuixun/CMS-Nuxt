import { and, asc, desc, eq, inArray, like, sql } from 'drizzle-orm';
import { NewTalent, Talent, talentTable } from '~~/server/db/schema/talent/talent';
import { talentPaperTable } from '~~/server/db/schema/talent/talentPaper';
import { talentPatentTable } from '~~/server/db/schema/talent/talentPatent';
import { talentTopicTable } from '~~/server/db/schema/talent/talentTopic';
import { queryParams } from '~~/server/db/query.helper';

type RelationPayload = {
  paperIds?: Array<number | string>;
  topicIds?: Array<number | string>;
  patentIds?: Array<number | string>;
};

type ExpertPayload = Partial<Talent> &
  RelationPayload & {
    id?: number | string;
    talentId?: number | string;
    researchArea?: string;
    institution?: string;
    bio?: string;
  };

export class ExpertLibraryServices {
  async add(payload: ExpertPayload) {
    const data = this.normalizeTalentPayload(payload);
    if (!data.name) {
      throw createError({ statusCode: 400, statusMessage: '专家姓名不能为空' });
    }

    return db.transaction(async tx => {
      const [inserted] = await tx.insert(talentTable).values(data).$returningId();
      const talentId = inserted.talentId;
      await this.syncRelations(tx, talentId, payload);
      return {
        ...data,
        talentId,
        id: talentId
      };
    });
  }

  async update(payload: ExpertPayload) {
    const talentId = Number(payload.talentId || payload.id);
    if (!talentId) {
      throw createError({ statusCode: 400, statusMessage: '缺少专家ID' });
    }

    const data = this.normalizeTalentPayload(payload);
    if (!data.name) {
      throw createError({ statusCode: 400, statusMessage: '专家姓名不能为空' });
    }

    await db.transaction(async tx => {
      await tx
        .update(talentTable)
        .set({
          ...data,
          updateTime: new Date()
        })
        .where(and(eq(talentTable.talentId, talentId), eq(talentTable.delFlag, '0')));
      await this.syncRelations(tx, talentId, payload);
    });
  }

  async pageList(params?: Partial<Talent & { keyword: string; researchArea: string } & queryParams>) {
    const { pageNum = 1, pageSize = 10, keyword, name, researchDirection, researchArea, title, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(talentTable.delFlag, '0')];

    const searchName = String(name || keyword || '').trim();
    if (searchName) {
      whereList.push(like(talentTable.name, `%${searchName}%`));
    }

    const direction = String(researchDirection || researchArea || '').trim();
    if (direction) {
      whereList.push(like(talentTable.researchDirection, `%${direction}%`));
    }

    if (title) {
      whereList.push(eq(talentTable.title, String(title)));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(talentTable.status, status));
    }

    const where = and(...whereList);

    const rowsQuery = db.query.talentTable.findMany({
      extras: {
        id: sql`${talentTable.talentId}`.as('id'),
        researchArea: sql`${talentTable.researchDirection}`.as('researchArea'),
        institution: sql`${talentTable.organization}`.as('institution'),
        bio: sql`${talentTable.profile}`.as('bio'),
        paperCount: db.$count(talentPaperTable, sql`${talentPaperTable.talentId} = ${talentTable.talentId}`).as('paperCount'),
        topicCount: db.$count(talentTopicTable, sql`${talentTopicTable.talentId} = ${talentTable.talentId}`).as('topicCount'),
        patentCount: db.$count(talentPatentTable, sql`${talentPatentTable.talentId} = ${talentTable.talentId}`).as('patentCount')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: [asc(talentTable.sort), desc(talentTable.updateTime), desc(talentTable.talentId)]
    });
    const totalQuery = db.$count(talentTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows,
      total
    };
  }

  async getById(id: number) {
    const talent = await db.query.talentTable.findFirst({
      extras: {
        id: sql`${talentTable.talentId}`.as('id'),
        researchArea: sql`${talentTable.researchDirection}`.as('researchArea'),
        institution: sql`${talentTable.organization}`.as('institution'),
        bio: sql`${talentTable.profile}`.as('bio')
      },
      where: and(eq(talentTable.talentId, id), eq(talentTable.delFlag, '0'))
    });

    if (!talent) {
      throw createError({ statusCode: 404, statusMessage: '专家不存在' });
    }

    const [paperIds, topicIds, patentIds] = await Promise.all([
      this.findPaperIds(id),
      this.findTopicIds(id),
      this.findPatentIds(id)
    ]);

    return {
      ...talent,
      paperIds,
      topicIds,
      patentIds,
      papers: paperIds.map(item => ({ id: item })),
      topics: topicIds.map(item => ({ id: item })),
      patents: patentIds.map(item => ({ id: item }))
    };
  }

  async delete(ids: string[]) {
    const talentIds = this.normalizeIds(ids);
    if (!talentIds.length) {
      throw createError({ statusCode: 400, statusMessage: '缺少专家ID' });
    }

    await db
      .update(talentTable)
      .set({
        delFlag: '1',
        updateTime: new Date()
      })
      .where(inArray(talentTable.talentId, talentIds));
  }

  async changeStatus(ids: Array<number | string>, status: string) {
    const talentIds = this.normalizeIds(ids);
    if (!talentIds.length) {
      throw createError({ statusCode: 400, statusMessage: '缺少专家ID' });
    }
    if (status !== '0' && status !== '1') {
      throw createError({ statusCode: 400, statusMessage: '状态值不正确' });
    }

    await db
      .update(talentTable)
      .set({
        status,
        updateTime: new Date()
      })
      .where(and(inArray(talentTable.talentId, talentIds), eq(talentTable.delFlag, '0')));
  }

  private async syncRelations(tx: any, talentId: number, payload: RelationPayload) {
    const paperIds = this.normalizeIds(payload.paperIds || []);
    const topicIds = this.normalizeIds(payload.topicIds || []);
    const patentIds = this.normalizeIds(payload.patentIds || []);

    await tx.delete(talentPaperTable).where(eq(talentPaperTable.talentId, talentId));
    await tx.delete(talentTopicTable).where(eq(talentTopicTable.talentId, talentId));
    await tx.delete(talentPatentTable).where(eq(talentPatentTable.talentId, talentId));

    if (paperIds.length) {
      await tx.insert(talentPaperTable).values(paperIds.map((paperId, sort) => ({ talentId, paperId, sort })));
    }
    if (topicIds.length) {
      await tx.insert(talentTopicTable).values(topicIds.map((topicId, sort) => ({ talentId, topicId, sort })));
    }
    if (patentIds.length) {
      await tx.insert(talentPatentTable).values(patentIds.map((patentId, sort) => ({ talentId, patentId, sort })));
    }
  }

  private normalizeTalentPayload(payload: ExpertPayload): NewTalent {
    return {
      name: String(payload.name || '').trim(),
      nameEn: payload.nameEn || '',
      gender: payload.gender || '3',
      avatar: payload.avatar || '',
      cardBackground: payload.cardBackground || payload.avatar || '',
      organization: payload.organization || payload.institution || '',
      department: payload.department || '',
      title: payload.title || '',
      position: payload.position || '',
      researchDirection: payload.researchDirection || payload.researchArea || '',
      profile: payload.profile ?? payload.bio ?? '',
      email: payload.email || '',
      phone: payload.phone || '',
      sort: Number(payload.sort || 0),
      status: payload.status === '1' ? '1' : '0',
      delFlag: '0',
      remark: payload.remark || ''
    };
  }

  private normalizeIds(ids: Array<number | string> | string[]) {
    const flatIds = ids.flatMap(id => String(id).split(','));
    return Array.from(new Set(flatIds.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0)));
  }

  private async findPaperIds(talentId: number) {
    const rows = await db.query.talentPaperTable.findMany({
      columns: { paperId: true },
      where: eq(talentPaperTable.talentId, talentId),
      orderBy: asc(talentPaperTable.sort)
    });
    return rows.map(row => row.paperId);
  }

  private async findTopicIds(talentId: number) {
    const rows = await db.query.talentTopicTable.findMany({
      columns: { topicId: true },
      where: eq(talentTopicTable.talentId, talentId),
      orderBy: asc(talentTopicTable.sort)
    });
    return rows.map(row => row.topicId);
  }

  private async findPatentIds(talentId: number) {
    const rows = await db.query.talentPatentTable.findMany({
      columns: { patentId: true },
      where: eq(talentPatentTable.talentId, talentId),
      orderBy: asc(talentPatentTable.sort)
    });
    return rows.map(row => row.patentId);
  }
}
