import { TopicSpaceTimeServices } from '~~/server/services/admin/talent/topicSpaceTime.services';

const topicSpaceTimeServices = new TopicSpaceTimeServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  await topicSpaceTimeServices.changeStatus(body.ids || [body.id], body.status);
  return createApiResponse(null);
});
