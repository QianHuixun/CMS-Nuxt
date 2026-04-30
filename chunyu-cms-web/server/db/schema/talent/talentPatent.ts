import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';
import { talentTable } from './talent';

export const talentPatentTable = mysqlTable('talent_patent', {
  talentPatentId: int('talent_patent_id').autoincrement().primaryKey(),
  talentId: int('talent_id').notNull().references(() => talentTable.talentId),
  patentId: int('patent_id').notNull(),
  relationRole: varchar('relation_role', { length: 100 }).default(''),
  sort: int('sort').default(0),
  ...columnsHelpers
});

export type TalentPatent = typeof talentPatentTable.$inferSelect;
export type NewTalentPatent = typeof talentPatentTable.$inferInsert;
