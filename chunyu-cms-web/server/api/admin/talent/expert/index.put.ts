import { ExpertLibraryServices } from '~~/server/services/admin/talent/expertLibrary.services';

const expertLibraryServices = new ExpertLibraryServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  await expertLibraryServices.update(body);
  return createApiResponse(null);
});
