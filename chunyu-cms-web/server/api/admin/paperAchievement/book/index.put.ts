import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  await bookImportServices.update(body);
  return createApiResponse(null);
});
