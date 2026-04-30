import { char, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const bookImportBatchTable = mysqlTable('pa_book_import_batch', {
  importBatchId: int('import_batch_id').autoincrement().primaryKey(),
  importType: varchar('import_type', { length: 50 }).default('metadata'),
  fileName: varchar('file_name', { length: 255 }).default(''),
  fileUrl: varchar('file_url', { length: 500 }).default(''),
  totalCount: int('total_count').default(0),
  successCount: int('success_count').default(0),
  failCount: int('fail_count').default(0),
  status: char('status', { length: 1 }).default('1'),
  errorMessage: text('error_message'),
  ...columnsHelpers
});

export type BookImportBatch = typeof bookImportBatchTable.$inferSelect;
export type NewBookImportBatch = typeof bookImportBatchTable.$inferInsert;
