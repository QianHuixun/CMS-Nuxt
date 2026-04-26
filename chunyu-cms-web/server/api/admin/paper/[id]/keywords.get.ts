import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await paperServices.getPaperKeywords(id);
  return createApiResponse(result);
});
