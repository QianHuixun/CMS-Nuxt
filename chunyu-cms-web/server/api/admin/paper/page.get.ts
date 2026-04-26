import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, publishYear, isFeatured, status } = query as Record<string, string>;

  const result = await paperServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    publishYear,
    isFeatured,
    status
  });

  return createApiResponse(result);
});
