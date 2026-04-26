import { PatentServices } from '~~/server/services/admin/patent/patent.services';

const patentServices = new PatentServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await patentServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
