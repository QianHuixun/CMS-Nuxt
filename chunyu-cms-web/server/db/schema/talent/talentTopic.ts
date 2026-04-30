import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';
import { talentTable } from './talent';

export const talentTopicTable = mysqlTable('talent_topic', {
  talentTopicId: int('talent_topic_id').autoincrement().primaryKey(),
  talentId: int('talent_id').notNull().references(() => talentTable.talentId),
  topicId: int('topic_id').notNull(),
  relationRole: varchar('relation_role', { length: 100 }).default(''),
  sort: int('sort').default(0),
  ...columnsHelpers
});

export type TalentTopic = typeof talentTopicTable.$inferSelect;
export type NewTalentTopic = typeof talentTopicTable.$inferInsert;
