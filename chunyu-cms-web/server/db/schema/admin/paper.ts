import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const paperTable = mysqlTable('paper', {
  paperId: int('paper_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  abstract: text('abstract'),
  keywords: varchar('keywords', { length: 1000 }).default(''),
  publishYear: int('publish_year'),
  isFeatured: char('is_featured', { length: 1 }).default('0'),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Paper = typeof paperTable.$inferSelect;
export type NewPaper = typeof paperTable.$inferInsert;
