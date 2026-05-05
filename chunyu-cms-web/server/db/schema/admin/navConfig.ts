import { char, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const navConfigTable = mysqlTable('nav_config', {
  navConfigId: int('nav_config_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 150 }).notNull(),
  description: varchar('description', { length: 1000 }).default(''),
  url: varchar('url', { length: 500 }).default(''),
  icon: varchar('icon', { length: 500 }).default(''),
  sort: int('sort').default(0),
  status: varchar('status', { length: 20 }).default('active'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type NavConfig = typeof navConfigTable.$inferSelect;
export type NewNavConfig = typeof navConfigTable.$inferInsert;
