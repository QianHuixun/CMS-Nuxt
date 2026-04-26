import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const bookSimulationTable = mysqlTable('book_simulation', {
  bookSimulationId: int('book_simulation_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  author: varchar('author', { length: 300 }).default(''),
  publisher: varchar('publisher', { length: 300 }).default(''),
  publishYear: int('publish_year'),
  isbn: varchar('isbn', { length: 100 }).default(''),
  summary: text('summary'),
  coverImage: varchar('cover_image', { length: 500 }).default(''),
  backCoverImage: varchar('back_cover_image', { length: 500 }).default(''),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type BookSimulation = typeof bookSimulationTable.$inferSelect;
export type NewBookSimulation = typeof bookSimulationTable.$inferInsert;
