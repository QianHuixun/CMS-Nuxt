import { NavConfigServices } from '~~/server/services/admin/systemBaseConfig/navConfig.services';

const navConfigServices = new NavConfigServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await navConfigServices.getById(id);
  return createApiResponse(result);
});
