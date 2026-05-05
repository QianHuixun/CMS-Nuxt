import { NavConfigServices } from '~~/server/services/admin/systemBaseConfig/navConfig.services';

const navConfigServices = new NavConfigServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await navConfigServices.update(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
