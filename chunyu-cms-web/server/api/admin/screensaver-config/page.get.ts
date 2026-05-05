import { ScreenSaverConfigServices } from '~~/server/services/admin/systemBaseConfig/screenSaverConfig.services';

const screenSaverConfigServices = new ScreenSaverConfigServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, mediaType, status } = query as Record<string, string>;

  const result = await screenSaverConfigServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    mediaType,
    status
  });

  return createApiResponse(result);
});
