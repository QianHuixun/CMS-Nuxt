import { char, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const talentAchievementRelationTable = mysqlTable('talent_achievement_relation', {
  talentAchievementRelationId: int('talent_achievement_relation_id').autoincrement().primaryKey(),
  talentId: int('talent_id').notNull(),
  achievementType: varchar('achievement_type', { length: 20 }).notNull(),
  achievementId: int('achievement_id').notNull(),
  sort: int('sort').default(0),
  status: char('status', { length: 1 }).default('0'),
  delFlag: char('del_flag', { length: 1 }).default('0'),
  ...columnsHelpers
});

export type TalentAchievementRelation = typeof talentAchievementRelationTable.$inferSelect;
export type NewTalentAchievementRelation = typeof talentAchievementRelationTable.$inferInsert;
