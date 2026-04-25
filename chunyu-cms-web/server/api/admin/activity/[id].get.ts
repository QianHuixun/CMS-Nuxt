import { ActivityServices } from '~~/server/services/admin/activity/activity.services';

const activityServices = new ActivityServices();

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await activityServices.getById(id);
  return createApiResponse(result);
});
