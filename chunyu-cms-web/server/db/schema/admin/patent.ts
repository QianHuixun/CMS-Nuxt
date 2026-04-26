import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const patentTable = mysqlTable('patent', {
  patentId: int('patent_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  patentNo: varchar('patent_no', { length: 150 }).default(''),
  applicant: varchar('applicant', { length: 300 }).default(''),
  applyYear: int('apply_year'),
  abstract: text('abstract'),
  operationVideoUrl: varchar('operation_video_url', { length: 500 }).default(''),
  videoCoverUrl: varchar('video_cover_url', { length: 500 }).default(''),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Patent = typeof patentTable.$inferSelect;
export type NewPatent = typeof patentTable.$inferInsert;
