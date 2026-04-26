import { char, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const bookSimulationPageTable = mysqlTable('book_simulation_page', {
  bookSimulationPageId: int('book_simulation_page_id').autoincrement().primaryKey(),
  bookSimulationId: int('book_simulation_id').notNull(),
  pageTitle: varchar('page_title', { length: 200 }).default(''),
  pageNo: int('page_no').default(0),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  sort: int('sort').default(0),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type BookSimulationPage = typeof bookSimulationPageTable.$inferSelect;
export type NewBookSimulationPage = typeof bookSimulationPageTable.$inferInsert;
