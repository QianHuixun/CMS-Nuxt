import { ScreenSaverConfigServices } from '~~/server/services/admin/systemBaseConfig/screenSaverConfig.services';

const screenSaverConfigServices = new ScreenSaverConfigServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await screenSaverConfigServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
