import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody(event);
  await paperServices.updatePaperKeywords(id, body, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
