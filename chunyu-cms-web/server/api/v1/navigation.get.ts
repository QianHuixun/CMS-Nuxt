import { NavConfigServices } from '~~/server/services/admin/systemBaseConfig/navConfig.services';

const navConfigServices = new NavConfigServices();

export default defineEventHandler(async () => {
  const result = await navConfigServices.publicList();
  return createApiResponse(result);
});
