import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await bookImportServices.confirmImport(body);
  return createApiResponse(result);
});
