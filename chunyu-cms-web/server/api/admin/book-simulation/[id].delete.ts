import { BookSimulationServices } from '~~/server/services/admin/bookSimulation/bookSimulation.services';

const bookSimulationServices = new BookSimulationServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await bookSimulationServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
