import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await bookImportServices.importDetails(id);
  return createApiResponse(result);
});
