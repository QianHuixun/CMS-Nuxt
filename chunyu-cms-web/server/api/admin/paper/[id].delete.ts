import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await paperServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
