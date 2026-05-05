import { ResearchToolServices } from '~~/server/services/admin/coreResource/researchTool.services';

const researchToolServices = new ResearchToolServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, status } = query as Record<string, string>;

  const result = await researchToolServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    status
  });

  return createApiResponse(result);
});
