import { ResourceDatabaseServices } from '~~/server/services/admin/coreResource/resourceDatabase.services';

const resourceDatabaseServices = new ResourceDatabaseServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await resourceDatabaseServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
