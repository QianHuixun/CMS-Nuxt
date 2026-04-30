import ExcelJS from 'exceljs';

export default defineEventHandler(async event => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('书籍导入模板');
  worksheet.columns = [
    { header: '书名', key: 'title', width: 30 },
    { header: '作者', key: 'author', width: 20 },
    { header: 'ISBN', key: 'isbn', width: 24 },
    { header: '类别', key: 'category', width: 16 },
    { header: '出版社', key: 'publisher', width: 24 },
    { header: '出版日期', key: 'publishDate', width: 16 },
    { header: '简介', key: 'summary', width: 40 },
    { header: '状态', key: 'status', width: 12 }
  ];
  worksheet.addRow({
    title: '伤寒论注疏',
    author: '张仲景',
    isbn: '978-7-0000-0000-0',
    category: '中医理论',
    publisher: '中医古籍出版社',
    publishDate: '2024-01-01',
    summary: '示例简介',
    status: '草稿'
  });

  const buffer = await workbook.xlsx.writeBuffer();
  setHeader(event, 'content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  setHeader(event, 'content-disposition', 'attachment; filename="book-import-template.xlsx"');
  return Buffer.from(buffer);
});
