import { ResourceDatabaseServices } from '~~/server/services/admin/coreResource/resourceDatabase.services';

const resourceDatabaseServices = new ResourceDatabaseServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, status } = query as Record<string, string>;

  const result = await resourceDatabaseServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    status
  });

  return createApiResponse(result);
});
