import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const talentTable = mysqlTable('talent', {
  talentId: int('talent_id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  title: varchar('title', { length: 100 }).default(''),
  organization: varchar('organization', { length: 200 }).default(''),
  researchDirection: varchar('research_direction', { length: 500 }).default(''),
  resume: text('resume'),
  photoUrl: varchar('photo_url', { length: 500 }).default(''),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type Talent = typeof talentTable.$inferSelect;
export type NewTalent = typeof talentTable.$inferInsert;
