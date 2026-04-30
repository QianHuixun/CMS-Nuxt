import xlsx from 'node-xlsx';
import { and, asc, desc, eq, inArray, like, sql } from 'drizzle-orm';
import type { MultiPartData } from 'h3';
import { bookTable, type Book, type NewBook } from '~~/server/db/schema/paperAchievement/book';
import { bookImportBatchTable } from '~~/server/db/schema/paperAchievement/bookImportBatch';
import { bookImportDetailTable } from '~~/server/db/schema/paperAchievement/bookImportDetail';
import { queryParams } from '~~/server/db/query.helper';

type BookPayload = Partial<Book> & {
  id?: number | string;
  bookId?: number | string;
  cover?: string;
  description?: string;
};

type BookListParams = Partial<Book & {
  id: number;
  keyword: string;
  pageSize: number;
} & queryParams>;

type PreviewRow = {
  rowNo: number;
  title: string;
  subtitle: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishDate: string;
  publishYear?: number;
  summary: string;
  status: string;
  importStatus: 'success' | 'error';
  errorMessage: string;
};

const categoryValues = ['theory', 'clinical', 'pharmacy', 'acupuncture', 'health', 'other'];
const categoryLabelMap: Record<string, string> = {
  中医理论: 'theory',
  临床实践: 'clinical',
  中药学: 'pharmacy',
  针灸推拿: 'acupuncture',
  养生保健: 'health',
  其他: 'other'
};

export class BookImportServices {
  async add(payload: BookPayload) {
    const data = await this.normalizeBookPayload(payload);
    const [inserted] = await db.insert(bookTable).values(data).$returningId();

    return {
      ...data,
      bookId: inserted.bookId,
      id: inserted.bookId
    };
  }

  async update(payload: BookPayload) {
    const bookId = Number(payload.bookId || payload.id);
    if (!bookId) {
      throw createError({ statusCode: 400, statusMessage: '缺少书籍ID' });
    }

    const existed = await this.getExistingBook(bookId);
    if (!existed) {
      throw createError({ statusCode: 404, statusMessage: '书籍不存在' });
    }

    const data = await this.normalizeBookPayload(payload, bookId);
    await db
      .update(bookTable)
      .set({
        ...data,
        updateTime: new Date()
      })
      .where(and(eq(bookTable.bookId, bookId), eq(bookTable.delFlag, '0')));
  }

  async pageList(params?: BookListParams) {
    const { pageNum = 1, pageSize = 10, title, keyword, author, isbn, category, status, publishYear } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const whereList = [eq(bookTable.delFlag, '0')];
    const searchTitle = String(title || keyword || '').trim();
    const searchAuthor = String(author || '').trim();
    const searchIsbn = String(isbn || '').trim();

    if (searchTitle) {
      whereList.push(like(bookTable.title, `%${searchTitle}%`));
    }
    if (searchAuthor) {
      whereList.push(like(bookTable.author, `%${searchAuthor}%`));
    }
    if (searchIsbn) {
      whereList.push(like(bookTable.isbn, `%${searchIsbn}%`));
    }
    if (category) {
      whereList.push(eq(bookTable.category, String(category)));
    }
    if (status === '0' || status === '1') {
      whereList.push(eq(bookTable.status, status));
    }
    const year = Number(publishYear);
    if (Number.isInteger(year) && year > 0) {
      whereList.push(eq(bookTable.publishYear, year));
    }

    const where = and(...whereList);
    const rowsQuery = db.query.bookTable.findMany({
      extras: {
        id: sql`${bookTable.bookId}`.as('id'),
        cover: sql`${bookTable.coverImage}`.as('cover'),
        description: sql`${bookTable.summary}`.as('description')
      },
      where,
      offset,
      limit: Number(pageSize),
      orderBy: [asc(bookTable.sort), desc(bookTable.updateTime), desc(bookTable.bookId)]
    });
    const totalQuery = db.$count(bookTable, where);
    const [rows, total] = await Promise.all([rowsQuery, totalQuery]);

    return {
      rows,
      total
    };
  }

  async getById(id: number) {
    const book = await db.query.bookTable.findFirst({
      extras: {
        id: sql`${bookTable.bookId}`.as('id'),
        cover: sql`${bookTable.coverImage}`.as('cover'),
        description: sql`${bookTable.summary}`.as('description')
      },
      where: and(eq(bookTable.bookId, id), eq(bookTable.delFlag, '0'))
    });

    if (!book) {
      throw createError({ statusCode: 404, statusMessage: '书籍不存在' });
    }

    return book;
  }

  async delete(ids: Array<number | string> | string[]) {
    const bookIds = this.normalizeIds(ids);
    if (!bookIds.length) {
      throw createError({ statusCode: 400, statusMessage: '缺少书籍ID' });
    }

    await db
      .update(bookTable)
      .set({
        delFlag: '1',
        updateTime: new Date()
      })
      .where(inArray(bookTable.bookId, bookIds));
  }

  async changeStatus(ids: Array<number | string>, status: string) {
    const bookIds = this.normalizeIds(ids);
    if (!bookIds.length) {
      throw createError({ statusCode: 400, statusMessage: '缺少书籍ID' });
    }
    if (status !== '0' && status !== '1') {
      throw createError({ statusCode: 400, statusMessage: '状态值不正确' });
    }

    await db
      .update(bookTable)
      .set({
        status,
        updateTime: new Date()
      })
      .where(and(inArray(bookTable.bookId, bookIds), eq(bookTable.delFlag, '0')));
  }

  async bindObject(payload: BookPayload) {
    const bookId = Number(payload.bookId || payload.id);
    if (!bookId) {
      throw createError({ statusCode: 400, statusMessage: '缺少书籍ID' });
    }
    if (!payload.objectKey) {
      throw createError({ statusCode: 400, statusMessage: '缺少对象Key' });
    }

    await db
      .update(bookTable)
      .set({
        objectBucket: payload.objectBucket || '',
        objectKey: payload.objectKey || '',
        objectUrl: payload.objectUrl || '',
        objectEtag: payload.objectEtag || '',
        fileName: payload.fileName || '',
        fileSize: Number(payload.fileSize || 0),
        mimeType: payload.mimeType || '',
        storageProvider: payload.storageProvider || 'rustfs',
        updateTime: new Date()
      })
      .where(and(eq(bookTable.bookId, bookId), eq(bookTable.delFlag, '0')));
  }

  async previewImport(file: MultiPartData) {
    if (!file?.data?.length) {
      throw createError({ statusCode: 400, statusMessage: '未选择导入文件' });
    }

    const worksheets = xlsx.parse(Buffer.from(file.data));
    const worksheet = worksheets[0];
    if (!worksheet) {
      throw createError({ statusCode: 400, statusMessage: 'Excel 文件没有工作表' });
    }

    const rows: PreviewRow[] = [];
    const isbnList: string[] = [];
    worksheet.data.forEach((row, rowIndex) => {
      const rowNo = rowIndex + 1;
      if (rowNo === 1) return;
      const title = this.cellText(row[0]);
      const author = this.cellText(row[1]);
      const isbn = this.cellText(row[2]);
      const category = this.normalizeCategory(this.cellText(row[3]));
      const publisher = this.cellText(row[4]);
      const publishDate = this.normalizeImportDate(row[5]);
      const summary = this.cellText(row[6]);
      const status = this.cellText(row[7]) === '已发布' ? '1' : '0';

      if (!title && !author && !isbn && !category && !publisher && !publishDate && !summary) return;
      if (isbn) isbnList.push(isbn);

      rows.push({
        rowNo,
        title,
        subtitle: '',
        author,
        isbn,
        category,
        publisher,
        publishDate,
        publishYear: publishDate ? Number(publishDate.slice(0, 4)) : undefined,
        summary,
        status,
        importStatus: 'success',
        errorMessage: ''
      });
    });

    const existedIsbn = await this.findExistingIsbn(isbnList);
    const duplicateInFile = this.findDuplicateValues(isbnList);
    const previewRows = rows.map(row => {
      const errors = this.validateImportRow(row);
      if (row.isbn && existedIsbn.has(row.isbn)) errors.push('ISBN 已存在');
      if (row.isbn && duplicateInFile.has(row.isbn)) errors.push('文件内 ISBN 重复');

      return {
        ...row,
        importStatus: errors.length ? 'error' : 'success',
        errorMessage: errors.join('；')
      } as PreviewRow;
    });

    return {
      fileName: file.filename || '',
      total: previewRows.length,
      successCount: previewRows.filter(row => row.importStatus === 'success').length,
      failCount: previewRows.filter(row => row.importStatus === 'error').length,
      rows: previewRows
    };
  }

  async confirmImport(payload: { fileName?: string; rows?: PreviewRow[] }) {
    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    if (!rows.length) {
      throw createError({ statusCode: 400, statusMessage: '没有可导入数据' });
    }

    const successRows = rows.filter(row => row.importStatus !== 'error');
    const failRows = rows.filter(row => row.importStatus === 'error');
    const [insertedBatch] = await db
      .insert(bookImportBatchTable)
      .values({
        fileName: payload.fileName || '',
        totalCount: rows.length,
        successCount: successRows.length,
        failCount: failRows.length,
        status: failRows.length ? (successRows.length ? '2' : '1') : '0',
        errorMessage: failRows.slice(0, 5).map(row => `第${row.rowNo}行：${row.errorMessage}`).join('\n')
      })
      .$returningId();

    for (const row of rows) {
      let targetId: number | undefined;
      if (row.importStatus !== 'error') {
        const [insertedBook] = await db.insert(bookTable).values(this.normalizePreviewRow(row)).$returningId();
        targetId = insertedBook.bookId;
      }

      await db.insert(bookImportDetailTable).values({
        importBatchId: insertedBatch.importBatchId,
        rowNo: row.rowNo,
        rowData: JSON.stringify(row),
        targetId,
        status: row.importStatus === 'error' ? '1' : '0',
        errorMessage: row.errorMessage || ''
      });
    }

    return {
      importBatchId: insertedBatch.importBatchId,
      totalCount: rows.length,
      successCount: successRows.length,
      failCount: failRows.length
    };
  }

  async importHistory(params?: queryParams) {
    const { pageNum = 1, pageSize = 10 } = params || {};
    const offset = (Number(pageNum) - 1) * Number(pageSize);
    const [rows, total] = await Promise.all([
      db.query.bookImportBatchTable.findMany({
        extras: {
          id: sql`${bookImportBatchTable.importBatchId}`.as('id')
        },
        offset,
        limit: Number(pageSize),
        orderBy: [desc(bookImportBatchTable.createTime), desc(bookImportBatchTable.importBatchId)]
      }),
      db.$count(bookImportBatchTable)
    ]);

    return { rows, total };
  }

  async importDetails(importBatchId: number) {
    const rows = await db.query.bookImportDetailTable.findMany({
      where: eq(bookImportDetailTable.importBatchId, importBatchId),
      orderBy: [asc(bookImportDetailTable.rowNo)]
    });

    return rows;
  }

  async exportRows(params?: BookListParams) {
    const result = await this.pageList({ ...params, pageNum: 1, pageSize: 10000 });
    return result.rows;
  }

  private async normalizeBookPayload(payload: BookPayload, currentBookId?: number): Promise<NewBook> {
    const title = String(payload.title || '').trim();
    if (!title) {
      throw createError({ statusCode: 400, statusMessage: '书名不能为空' });
    }

    const isbn = String(payload.isbn || '').trim();
    if (isbn) {
      await this.assertUniqueIsbn(isbn, currentBookId);
    }

    const publishDate = this.normalizeDate(payload.publishDate);
    const publishYear = Number(payload.publishYear || (publishDate ? publishDate.slice(0, 4) : 0)) || undefined;
    const category = this.normalizeCategory(String(payload.category || '').trim());

    return {
      title,
      subtitle: payload.subtitle || '',
      author: payload.author || '',
      isbn,
      category,
      publisher: payload.publisher || '',
      publishYear,
      publishDate,
      coverImage: payload.coverImage || payload.cover || '',
      objectBucket: payload.objectBucket || '',
      objectKey: payload.objectKey || '',
      objectUrl: payload.objectUrl || '',
      objectEtag: payload.objectEtag || '',
      fileName: payload.fileName || '',
      fileSize: Number(payload.fileSize || 0),
      mimeType: payload.mimeType || '',
      storageProvider: payload.storageProvider || 'rustfs',
      summary: payload.summary || payload.description || '',
      sourceFileUrl: payload.sourceFileUrl || '',
      sort: Number(payload.sort || 0),
      status: payload.status === '1' ? '1' : '0',
      delFlag: '0',
      remark: payload.remark || ''
    };
  }

  private normalizePreviewRow(row: PreviewRow): NewBook {
    return {
      title: row.title,
      subtitle: row.subtitle || '',
      author: row.author || '',
      isbn: row.isbn || '',
      category: row.category || '',
      publisher: row.publisher || '',
      publishYear: row.publishYear,
      publishDate: row.publishDate || undefined,
      summary: row.summary || '',
      status: row.status === '1' ? '1' : '0',
      delFlag: '0',
      storageProvider: 'rustfs'
    };
  }

  private validateImportRow(row: PreviewRow) {
    const errors: string[] = [];
    if (!row.title) errors.push('书名不能为空');
    if (!row.author) errors.push('作者不能为空');
    if (row.category && !categoryValues.includes(row.category)) errors.push('类别不正确');
    if (row.publishDate && !/^\d{4}-\d{2}-\d{2}$/.test(row.publishDate)) errors.push('出版日期格式不正确');
    return errors;
  }

  private async getExistingBook(bookId: number) {
    return db.query.bookTable.findFirst({
      columns: { bookId: true },
      where: and(eq(bookTable.bookId, bookId), eq(bookTable.delFlag, '0'))
    });
  }

  private async assertUniqueIsbn(isbn: string, currentBookId?: number) {
    const existed = await db.query.bookTable.findFirst({
      columns: { bookId: true },
      where: and(eq(bookTable.isbn, isbn), eq(bookTable.delFlag, '0'))
    });

    if (existed && existed.bookId !== currentBookId) {
      throw createError({ statusCode: 400, statusMessage: 'ISBN 已存在' });
    }
  }

  private async findExistingIsbn(isbnList: string[]) {
    const cleanList = Array.from(new Set(isbnList.filter(Boolean)));
    if (!cleanList.length) return new Set<string>();

    const rows = await db.query.bookTable.findMany({
      columns: { isbn: true },
      where: and(inArray(bookTable.isbn, cleanList), eq(bookTable.delFlag, '0'))
    });
    return new Set(rows.map(row => row.isbn || '').filter(Boolean));
  }

  private findDuplicateValues(values: string[]) {
    const countMap = new Map<string, number>();
    values.filter(Boolean).forEach(value => countMap.set(value, (countMap.get(value) || 0) + 1));
    return new Set(Array.from(countMap.entries()).filter(([, count]) => count > 1).map(([value]) => value));
  }

  private normalizeCategory(value: string) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (categoryValues.includes(text)) return text;
    return categoryLabelMap[text] || text;
  }

  private normalizeDate(value?: string | Date | null) {
    if (!value) return undefined;
    if (value instanceof Date) return this.formatDate(value);
    const dateText = String(value).trim().slice(0, 10);
    if (!dateText) return undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      throw createError({ statusCode: 400, statusMessage: '日期格式不正确' });
    }
    return dateText;
  }

  private normalizeImportDate(value: unknown) {
    if (!value) return '';
    if (value instanceof Date) return this.formatDate(value);
    const text = this.cellText(value);
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(text)) {
      const [year, month, day] = text.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return text;
  }

  private formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private normalizeIds(ids: Array<number | string> | string[]) {
    const flatIds = ids.flatMap(id => String(id).split(','));
    return Array.from(new Set(flatIds.map(id => Number(id)).filter(id => Number.isInteger(id) && id > 0)));
  }

  private cellText(value: unknown) {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return this.formatDate(value);
    if (typeof value === 'object') {
      if ('text' in value) return String(value.text || '').trim();
      if ('result' in value) return String(value.result || '').trim();
      if ('richText' in value && Array.isArray(value.richText)) {
        return value.richText.map((item: { text?: string }) => item.text || '').join('').trim();
      }
    }
    return String(value).trim();
  }
}
