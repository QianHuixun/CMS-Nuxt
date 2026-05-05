import { ResourceDatabaseServices } from '~~/server/services/admin/coreResource/resourceDatabase.services';

const resourceDatabaseServices = new ResourceDatabaseServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await resourceDatabaseServices.update(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
