import { ActivityServices } from '~~/server/services/admin/activity/activity.services';

const activityServices = new ActivityServices();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = await activityServices.add(body);
  return createApiResponse(result);
});
