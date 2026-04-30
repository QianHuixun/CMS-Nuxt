import { char, int, mysqlTable, text } from 'drizzle-orm/mysql-core';
import { columnsHelpers } from '../../columns.helpers';

export const bookImportDetailTable = mysqlTable('pa_book_import_detail', {
  importDetailId: int('import_detail_id').autoincrement().primaryKey(),
  importBatchId: int('import_batch_id').notNull(),
  rowNo: int('row_no').notNull(),
  rowData: text('row_data'),
  targetId: int('target_id'),
  status: char('status', { length: 1 }).default('1'),
  errorMessage: text('error_message'),
  ...columnsHelpers
});

export type BookImportDetail = typeof bookImportDetailTable.$inferSelect;
export type NewBookImportDetail = typeof bookImportDetailTable.$inferInsert;
