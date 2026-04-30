import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, keyword, author, isbn, category, status, publishYear } = query as any;

  const result = await bookImportServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    keyword,
    author,
    isbn,
    category,
    status,
    publishYear
  });

  return createApiResponse(result);
});
