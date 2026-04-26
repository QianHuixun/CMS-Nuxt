import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async () => {
  const result = await paperServices.getGlobalKeywordCloud();
  return createApiResponse(result);
});
