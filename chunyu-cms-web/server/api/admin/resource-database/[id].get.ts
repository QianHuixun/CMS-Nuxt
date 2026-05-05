import { ResourceDatabaseServices } from '~~/server/services/admin/coreResource/resourceDatabase.services';

const resourceDatabaseServices = new ResourceDatabaseServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await resourceDatabaseServices.getById(id);
  return createApiResponse(result);
});
