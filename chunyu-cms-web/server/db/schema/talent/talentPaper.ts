import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';
import { talentTable } from './talent';

export const talentPaperTable = mysqlTable('talent_paper', {
  talentPaperId: int('talent_paper_id').autoincrement().primaryKey(),
  talentId: int('talent_id').notNull().references(() => talentTable.talentId),
  paperId: int('paper_id').notNull(),
  relationRole: varchar('relation_role', { length: 100 }).default(''),
  sort: int('sort').default(0),
  ...columnsHelpers
});

export type TalentPaper = typeof talentPaperTable.$inferSelect;
export type NewTalentPaper = typeof talentPaperTable.$inferInsert;
