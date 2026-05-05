import { ScreenSaverConfigServices } from '~~/server/services/admin/systemBaseConfig/screenSaverConfig.services';

const screenSaverConfigServices = new ScreenSaverConfigServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await screenSaverConfigServices.getById(id);
  return createApiResponse(result);
});
