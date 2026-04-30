import { bigint, char, date, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const bookTable = mysqlTable('pa_book', {
  bookId: int('book_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  subtitle: varchar('subtitle', { length: 300 }).default(''),
  author: varchar('author', { length: 500 }).default(''),
  isbn: varchar('isbn', { length: 100 }).default(''),
  category: varchar('category', { length: 100 }).default(''),
  publisher: varchar('publisher', { length: 300 }).default(''),
  publishYear: int('publish_year'),
  publishDate: date('publish_date', { mode: 'string' }),
  coverImage: varchar('cover_image', { length: 500 }).default(''),
  objectBucket: varchar('object_bucket', { length: 255 }).default(''),
  objectKey: varchar('object_key', { length: 500 }).default(''),
  objectUrl: varchar('object_url', { length: 1000 }).default(''),
  objectEtag: varchar('object_etag', { length: 255 }).default(''),
  fileName: varchar('file_name', { length: 255 }).default(''),
  fileSize: bigint('file_size', { mode: 'number' }).default(0),
  mimeType: varchar('mime_type', { length: 150 }).default(''),
  storageProvider: varchar('storage_provider', { length: 50 }).default('rustfs'),
  summary: text('summary'),
  sourceFileUrl: varchar('source_file_url', { length: 500 }).default(''),
  sort: int('sort').default(0),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Book = typeof bookTable.$inferSelect;
export type NewBook = typeof bookTable.$inferInsert;
