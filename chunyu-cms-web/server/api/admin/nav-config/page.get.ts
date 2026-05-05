import { NavConfigServices } from '~~/server/services/admin/systemBaseConfig/navConfig.services';

const navConfigServices = new NavConfigServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, status } = query as Record<string, string>;

  const result = await navConfigServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    status
  });

  return createApiResponse(result);
});
