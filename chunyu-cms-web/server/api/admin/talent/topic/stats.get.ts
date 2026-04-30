import { TopicSpaceTimeServices } from '~~/server/services/admin/talent/topicSpaceTime.services';

const topicSpaceTimeServices = new TopicSpaceTimeServices();

export default defineEventHandler(async () => {
  const result = await topicSpaceTimeServices.stats();
  return createApiResponse(result);
});
