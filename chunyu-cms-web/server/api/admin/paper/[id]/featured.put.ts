import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody(event);
  const result = await paperServices.updateFeatured(id, body?.isFeatured, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
