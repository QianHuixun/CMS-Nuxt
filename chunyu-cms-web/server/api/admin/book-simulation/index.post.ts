import { BookSimulationServices } from '~~/server/services/admin/bookSimulation/bookSimulation.services';

const bookSimulationServices = new BookSimulationServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await bookSimulationServices.add(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
