import { NavConfigServices } from '~~/server/services/admin/systemBaseConfig/navConfig.services';

const navConfigServices = new NavConfigServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await navConfigServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
