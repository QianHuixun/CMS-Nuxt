import { char, date, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const topicTable = mysqlTable('topic', {
  topicId: int('topic_id').autoincrement().primaryKey(),
  // 课题名称
  title: varchar('title', { length: 300 }).notNull(),
  // 课题编号
  topicNo: varchar('topic_no', { length: 100 }).default(''),
  // 课题级别 national/provincial/municipal/school
  level: varchar('level', { length: 100 }).default(''),
  // 项目来源
  source: varchar('source', { length: 200 }).default(''),
  // 负责人
  leader: varchar('leader', { length: 100 }).default(''),
  // 研究状态 preparing/ongoing/completed
  researchStatus: varchar('research_status', { length: 50 }).default('preparing'),
  // 进度 0-100
  progress: int('progress').default(0),
  // 开始年份
  startYear: int('start_year'),
  // 结束年份
  endYear: int('end_year'),
  // 开始日期
  startDate: date('start_date', { mode: 'string' }),
  // 结束日期
  endDate: date('end_date', { mode: 'string' }),
  // 摘要
  summary: text('summary'),
  // 排序
  sort: int('sort').default(0),
  // 状态 0 启用 1 停用
  status: char('status', { length: 1 }).default('0'),
  // 删除标志 0 未删除 1 已删除
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Topic = typeof topicTable.$inferSelect;
export type NewTopic = typeof topicTable.$inferInsert;
