import { char, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const paperKeywordTable = mysqlTable('paper_keyword', {
  paperKeywordId: int('paper_keyword_id').autoincrement().primaryKey(),
  paperId: int('paper_id').notNull(),
  keyword: varchar('keyword', { length: 100 }).notNull(),
  weight: int('weight').default(1),
  source: char('source', { length: 1 }).default('0'),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type PaperKeyword = typeof paperKeywordTable.$inferSelect;
export type NewPaperKeyword = typeof paperKeywordTable.$inferInsert;
