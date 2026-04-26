import { PatentServices } from '~~/server/services/admin/patent/patent.services';

const patentServices = new PatentServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, applyYear, status } = query as Record<string, string>;

  const result = await patentServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    applyYear,
    status
  });

  return createApiResponse(result);
});
