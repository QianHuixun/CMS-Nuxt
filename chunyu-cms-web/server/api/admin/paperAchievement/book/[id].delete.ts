import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id') || '';
  await bookImportServices.delete(id.split(','));
  return createApiResponse(null);
});
