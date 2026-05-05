import { char, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const screenSaverConfigTable = mysqlTable('screen_saver_config', {
  screensaverConfigId: int('screensaver_config_id').autoincrement().primaryKey(),
  title: varchar('title', { length: 150 }).notNull(),
  mediaType: varchar('media_type', { length: 20 }).default('image'),
  mediaUrl: varchar('media_url', { length: 500 }).default(''),
  coverUrl: varchar('cover_url', { length: 500 }).default(''),
  triggerSeconds: int('trigger_seconds').default(300),
  sort: int('sort').default(0),
  status: varchar('status', { length: 20 }).default('active'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type ScreenSaverConfig = typeof screenSaverConfigTable.$inferSelect;
export type NewScreenSaverConfig = typeof screenSaverConfigTable.$inferInsert;
