import { ResourceDatabaseServices } from '~~/server/services/admin/coreResource/resourceDatabase.services';

const resourceDatabaseServices = new ResourceDatabaseServices();

export default defineEventHandler(async () => {
  const result = await resourceDatabaseServices.publicList();
  return createApiResponse(result);
});
