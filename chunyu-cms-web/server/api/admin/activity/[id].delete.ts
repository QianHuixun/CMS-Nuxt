import { ActivityServices } from '~~/server/services/admin/activity/activity.services';

const activityServices = new ActivityServices();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  await activityServices.delete([id as string]);
  return createApiResponse(null);
});
