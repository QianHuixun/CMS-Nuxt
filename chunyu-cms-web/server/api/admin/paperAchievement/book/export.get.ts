import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const query = getQuery(event) as any;
  const rows = await bookImportServices.exportRows(query);
  const header = ['书名', '作者', 'ISBN', '类别', '出版社', '出版日期', '状态', '对象Key', '访问地址'];
  const csvRows = rows.map(row =>
    [
      row.title,
      row.author,
      row.isbn,
      row.category,
      row.publisher,
      row.publishDate,
      row.status === '1' ? '已发布' : '草稿',
      row.objectKey,
      row.objectUrl
    ]
      .map(value => `"${String(value || '').replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = `\uFEFF${header.join(',')}\n${csvRows.join('\n')}`;

  setHeader(event, 'content-type', 'text/csv;charset=utf-8');
  setHeader(event, 'content-disposition', 'attachment; filename="books.csv"');
  return csv;
});
