import { ExpertLibraryServices } from '~~/server/services/admin/talent/expertLibrary.services';

const expertLibraryServices = new ExpertLibraryServices();

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id') || '';
  await expertLibraryServices.delete(String(id).split(','));
  return createApiResponse(null);
});
