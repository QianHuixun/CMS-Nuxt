import { TopicSpaceTimeServices } from '~~/server/services/admin/talent/topicSpaceTime.services';

const topicSpaceTimeServices = new TopicSpaceTimeServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await topicSpaceTimeServices.add(body);
  return createApiResponse(result);
});
