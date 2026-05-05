import { ScreenSaverConfigServices } from '~~/server/services/admin/systemBaseConfig/screenSaverConfig.services';

const screenSaverConfigServices = new ScreenSaverConfigServices();

export default defineEventHandler(async () => {
  const result = await screenSaverConfigServices.publicList();
  return createApiResponse(result);
});
