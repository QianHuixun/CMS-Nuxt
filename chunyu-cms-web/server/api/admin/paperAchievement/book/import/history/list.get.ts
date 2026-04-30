import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const result = await bookImportServices.importHistory({
    pageNum: Number(query.pageNum || 1),
    pageSize: Number(query.pageSize || 10)
  });

  return createApiResponse(result);
});
