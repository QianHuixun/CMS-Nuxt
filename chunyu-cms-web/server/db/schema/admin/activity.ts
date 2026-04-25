import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const activityTable = mysqlTable('activity', {
  activityId: int('activity_id').autoincrement().primaryKey(),
  // 活动名称
  name: varchar('name', { length: 255 }).notNull(),
  // 活动描述
  description: text('description'),
  // 缩略图
  thumbnail: varchar('thumbnail', { length: 500 }),
  // 内容区块 JSON
  contentBlocks: text('content_blocks'),
  // 富文本内容 HTML
  contentHtml: text('content_html'),
  // 是否头条 0: 否 1: 是
  isHeadline: char('is_headline', { length: 1 }).default('0'),
  // 排序
  sort: int('sort').default(0),
  // 状态 0: 草稿 1: 发布
  status: char('status', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Activity = typeof activityTable.$inferSelect;
export type NewActivity = typeof activityTable.$inferInsert;
