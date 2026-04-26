import { and, desc, eq, inArray, like, sql } from 'drizzle-orm';
import { queryParams } from '~~/server/db/query.helper';
import { BookSimulation, bookSimulationTable, NewBookSimulation } from '~~/server/db/schema/admin/bookSimulation';
import { bookSimulationPageTable, NewBookSimulationPage } from '~~/server/db/schema/admin/bookSimulationPage';

type BookSimulationPageInput = {
  pageId?: number;
  pageTitle?: string;
  pageNo?: number | string | null;
  imageUrl?: string;
  sort?: number | string | null;
  status?: string;
};

type BookSimulationPageParams = Partial<
  queryParams & {
    pageNum: number;
    pageSize: number;
    title: string;
    publishYear: number | string;
    status: string;
  }
>;

type BookSimulationMutationBody = Partial<
  NewBookSimulation & {
    id?: number;
    bookId?: number;
    publishYear?: number | string | null;
    description?: string;
    coverUrl?: string;
    backCoverUrl?: string;
    chapterImages?: BookSimulationPageInput[];
  }
>;

export class BookSimulationServices {
  async pageList(params?: BookSimulationPageParams) {
    const { pageNum = 1, pageSize = 10, title, publishYear, status } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(bookSimulationTable.delFlag, '0')];

    if (title) {
      whereList.push(like(bookSimulationTable.title, `%${title}%`));
    }

    if (publishYear !== undefined && publishYear !== null && String(publishYear).trim()) {
      whereList.push(eq(bookSimulationTable.publishYear, Number(publishYear)));
    }

    if (status === '0' || status === '1') {
      whereList.push(eq(bookSimulationTable.status, status));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.bookSimulationTable.findMany({
      extras: {
        id: sql<number>`${bookSimulationTable.bookSimulationId}`.as('id')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: (table, { desc }) => [desc(table.publishYear), desc(table.updateTime), desc(table.bookSimulationId)]
    });
    const totalQuery = db.$count(bookSimulationTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);
    const chapterCountMap = await this.getChapterCountMap(rows.map(row => row.bookSimulationId));

    return {
      rows: rows.map(row => ({
        ...this.mapBookSimulationEntity(row),
        chapterImageCount: chapterCountMap.get(row.bookSimulationId) || 0
      })),
      total
    };
  }

  async getById(bookId: number) {
    const book = await this.findBookById(bookId);
    const chapterImages = await db
      .select({
        pageId: bookSimulationPageTable.bookSimulationPageId,
        pageTitle: bookSimulationPageTable.pageTitle,
        pageNo: bookSimulationPageTable.pageNo,
        imageUrl: bookSimulationPageTable.imageUrl,
        sort: bookSimulationPageTable.sort,
        status: bookSimulationPageTable.status
      })
      .from(bookSimulationPageTable)
      .where(and(eq(bookSimulationPageTable.bookSimulationId, bookId), eq(bookSimulationPageTable.delFlag, '0')))
      .orderBy(bookSimulationPageTable.sort, bookSimulationPageTable.pageNo, bookSimulationPageTable.bookSimulationPageId);

    return {
      ...this.mapBookSimulationEntity({
        ...book,
        id: book.bookSimulationId
      }),
      chapterImages
    };
  }

  async add(body: BookSimulationMutationBody, userName = 'system') {
    const insertedBookId = await db.transaction(async tx => {
      const payload = this.normalizeBookMutationBody(body, userName);
      const [inserted] = await tx.insert(bookSimulationTable).values(payload).$returningId();
      await this.replaceChapterImages(tx, inserted.bookSimulationId, body.chapterImages, userName);
      return inserted.bookSimulationId;
    });

    return this.getById(insertedBookId);
  }

  async update(body: BookSimulationMutationBody, userName = 'system') {
    const bookId = Number(body.bookId || body.id);
    if (!bookId) {
      throw createError({ statusCode: 400, message: '缺少书籍ID' });
    }

    await this.findBookById(bookId);

    await db.transaction(async tx => {
      const payload = this.normalizeBookMutationBody(body, userName, true);
      await tx.update(bookSimulationTable).set(payload).where(eq(bookSimulationTable.bookSimulationId, bookId));
      await this.replaceChapterImages(tx, bookId, body.chapterImages, userName);
    });

    return this.getById(bookId);
  }

  async delete(bookId: number, userName = 'system') {
    await this.findBookById(bookId);
    await db.transaction(async tx => {
      await tx.update(bookSimulationTable).set({
        delFlag: '1',
        updateBy: userName,
        updateTime: new Date()
      }).where(eq(bookSimulationTable.bookSimulationId, bookId));

      await tx.update(bookSimulationPageTable).set({
        delFlag: '1',
        updateBy: userName,
        updateTime: new Date()
      }).where(eq(bookSimulationPageTable.bookSimulationId, bookId));
    });
  }

  private async findBookById(bookId: number): Promise<BookSimulation> {
    if (!bookId) {
      throw createError({ statusCode: 400, message: '缺少书籍ID' });
    }

    const book = await db.query.bookSimulationTable.findFirst({
      where: and(eq(bookSimulationTable.bookSimulationId, bookId), eq(bookSimulationTable.delFlag, '0'))
    });

    if (!book) {
      throw createError({ statusCode: 404, message: '书籍仿真记录不存在' });
    }

    return book;
  }

  private normalizeBookMutationBody(body: BookSimulationMutationBody, userName: string, isUpdate = false) {
    const payload: BookSimulationMutationBody = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      author: typeof body.author === 'string' ? body.author.trim() : '',
      publisher: typeof body.publisher === 'string' ? body.publisher.trim() : '',
      publishYear: this.normalizeYear(body.publishYear),
      isbn: typeof body.isbn === 'string' ? body.isbn.trim() : '',
      summary: typeof body.description === 'string' ? body.description : (body.summary || ''),
      coverImage: typeof body.coverUrl === 'string' ? body.coverUrl : (body.coverImage || ''),
      backCoverImage: typeof body.backCoverUrl === 'string' ? body.backCoverUrl : (body.backCoverImage || ''),
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
      throw createError({ statusCode: 400, message: '书名不能为空' });
    }

    return payload;
  }

  private normalizeYear(value?: number | string | null) {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const year = Number(value);
    if (!Number.isInteger(year) || year < 0) {
      throw createError({ statusCode: 400, message: '出版年份格式不正确' });
    }

    return year;
  }

  private mapBookSimulationEntity(row: BookSimulation & { id?: number }) {
    return {
      id: row.id || row.bookSimulationId,
      bookId: row.bookSimulationId,
      title: row.title,
      author: row.author || '',
      publisher: row.publisher || '',
      publishYear: row.publishYear,
      isbn: row.isbn || '',
      description: row.summary || '',
      coverUrl: row.coverImage || '',
      backCoverUrl: row.backCoverImage || '',
      status: row.status,
      updateTime: row.updateTime
    };
  }

  private async getChapterCountMap(bookIds: number[]) {
    const idList = bookIds.filter(Boolean);
    if (!idList.length) {
      return new Map<number, number>();
    }

    const rows = await db
      .select({
        bookId: bookSimulationPageTable.bookSimulationId,
        count: sql<number>`count(*)`.as('count')
      })
      .from(bookSimulationPageTable)
      .where(and(inArray(bookSimulationPageTable.bookSimulationId, idList), eq(bookSimulationPageTable.delFlag, '0')))
      .groupBy(bookSimulationPageTable.bookSimulationId);

    return new Map(rows.map(row => [row.bookId, Number(row.count || 0)]));
  }

  private async replaceChapterImages(tx: typeof db, bookId: number, chapterImages: BookSimulationPageInput[] | undefined, userName: string) {
    await tx.delete(bookSimulationPageTable).where(eq(bookSimulationPageTable.bookSimulationId, bookId));

    const rows = Array.isArray(chapterImages) ? chapterImages : [];
    const insertRows: NewBookSimulationPage[] = rows
      .filter(item => typeof item?.imageUrl === 'string' && item.imageUrl.trim())
      .map((item, index) => ({
        bookSimulationId: bookId,
        pageTitle: typeof item.pageTitle === 'string' ? item.pageTitle.trim() : '',
        pageNo: this.normalizePageNumber(item.pageNo, index + 1),
        imageUrl: item.imageUrl!.trim(),
        sort: this.normalizePageNumber(item.sort, index + 1),
        status: item.status === '1' ? '1' : '0',
        delFlag: '0',
        createBy: userName,
        createTime: new Date(),
        updateBy: userName,
        updateTime: new Date()
      }));

    if (insertRows.length > 0) {
      await tx.insert(bookSimulationPageTable).values(insertRows);
    }
  }

  private normalizePageNumber(value: number | string | null | undefined, fallback: number) {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }
    const num = Number(value);
    return Number.isInteger(num) && num > 0 ? num : fallback;
  }
}
