import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  await bookImportServices.changeStatus(body.ids || [body.id || body.bookId], String(body.status));
  return createApiResponse(null);
});
