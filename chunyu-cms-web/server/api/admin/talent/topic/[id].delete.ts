import { TopicSpaceTimeServices } from '~~/server/services/admin/talent/topicSpaceTime.services';

const topicSpaceTimeServices = new TopicSpaceTimeServices();

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id') || '';
  await topicSpaceTimeServices.delete(String(id).split(','));
  return createApiResponse(null);
});
