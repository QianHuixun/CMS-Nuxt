import { BookSimulationServices } from '~~/server/services/admin/bookSimulation/bookSimulation.services';

const bookSimulationServices = new BookSimulationServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, publishYear, status } = query as Record<string, string>;

  const result = await bookSimulationServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    publishYear,
    status
  });

  return createApiResponse(result);
});
