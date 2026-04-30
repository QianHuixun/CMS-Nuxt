import { ExpertLibraryServices } from '~~/server/services/admin/talent/expertLibrary.services';

const expertLibraryServices = new ExpertLibraryServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, name, keyword, researchDirection, researchArea, title, status } = query as any;

  const result = await expertLibraryServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    name,
    keyword,
    researchDirection,
    researchArea,
    title,
    status
  });

  return createApiResponse(result);
});
