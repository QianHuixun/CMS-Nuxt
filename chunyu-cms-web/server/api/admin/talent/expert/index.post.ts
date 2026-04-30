import { ExpertLibraryServices } from '~~/server/services/admin/talent/expertLibrary.services';

const expertLibraryServices = new ExpertLibraryServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await expertLibraryServices.add(body);
  return createApiResponse(result);
});
