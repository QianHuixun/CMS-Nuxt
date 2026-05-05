import { ScreenSaverConfigServices } from '~~/server/services/admin/systemBaseConfig/screenSaverConfig.services';

const screenSaverConfigServices = new ScreenSaverConfigServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await screenSaverConfigServices.add(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
