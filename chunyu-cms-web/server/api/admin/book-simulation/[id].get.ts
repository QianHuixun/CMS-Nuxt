import { BookSimulationServices } from '~~/server/services/admin/bookSimulation/bookSimulation.services';

const bookSimulationServices = new BookSimulationServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await bookSimulationServices.getById(id);
  return createApiResponse(result);
});
