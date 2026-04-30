import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const talentTable = mysqlTable('talent', {
  talentId: int('talent_id').autoincrement().primaryKey(),
  // 姓名
  name: varchar('name', { length: 100 }).notNull(),
  // 英文名
  nameEn: varchar('name_en', { length: 150 }).default(''),
  // 性别 1 男 2 女 3 未知
  gender: char('gender', { length: 1 }).default('3'),
  // 头像/高清照片
  avatar: varchar('avatar', { length: 500 }).default(''),
  // 卡片背景图
  cardBackground: varchar('card_background', { length: 500 }).default(''),
  // 所属机构
  organization: varchar('organization', { length: 200 }).default(''),
  // 院系/部门
  department: varchar('department', { length: 200 }).default(''),
  // 职称
  title: varchar('title', { length: 100 }).default(''),
  // 职务
  position: varchar('position', { length: 100 }).default(''),
  // 研究方向
  researchDirection: varchar('research_direction', { length: 500 }).default(''),
  // 个人简介
  profile: text('profile'),
  // 邮箱
  email: varchar('email', { length: 150 }).default(''),
  // 联系电话
  phone: varchar('phone', { length: 50 }).default(''),
  // 排序
  sort: int('sort').default(0),
  // 状态 0 启用 1 停用
  status: char('status', { length: 1 }).default('0'),
  // 删除标志 0 未删除 1 已删除
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Talent = typeof talentTable.$inferSelect;
export type NewTalent = typeof talentTable.$inferInsert;
