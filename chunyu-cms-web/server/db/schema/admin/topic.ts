import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const topicTable = mysqlTable('topic', {
  topicId: int('topic_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  topicNo: varchar('topic_no', { length: 150 }).default(''),
  leader: varchar('leader', { length: 100 }).default(''),
  projectYear: int('project_year'),
  source: varchar('source', { length: 300 }).default(''),
  abstract: text('abstract'),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Topic = typeof topicTable.$inferSelect;
export type NewTopic = typeof topicTable.$inferInsert;
