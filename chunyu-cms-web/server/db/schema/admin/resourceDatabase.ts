import { char, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const resourceDatabaseTable = mysqlTable('resource_database', {
  databaseId: int('database_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 150 }).notNull(),
  info: varchar('info', { length: 1000 }).default(''),
  url: varchar('url', { length: 500 }).default(''),
  icon: varchar('icon', { length: 500 }).default(''),
  coverUrl: varchar('cover_url', { length: 500 }).default(''),
  status: varchar('status', { length: 20 }).default('active'),
  sort: int('sort').default(0),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type ResourceDatabase = typeof resourceDatabaseTable.$inferSelect;
export type NewResourceDatabase = typeof resourceDatabaseTable.$inferInsert;
