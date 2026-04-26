import { TopicServices } from '~~/server/services/admin/topic/topic.services';

const topicServices = new TopicServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await topicServices.getById(id);
  return createApiResponse(result);
});
