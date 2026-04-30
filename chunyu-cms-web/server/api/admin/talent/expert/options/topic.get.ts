import { TopicSpaceTimeServices } from '~~/server/services/admin/talent/topicSpaceTime.services';

const topicSpaceTimeServices = new TopicSpaceTimeServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const result = await topicSpaceTimeServices.optionList(query as any);
  return createApiResponse(result);
});
