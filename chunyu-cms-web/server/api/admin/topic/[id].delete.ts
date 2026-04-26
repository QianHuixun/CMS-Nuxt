import { TopicServices } from '~~/server/services/admin/topic/topic.services';

const topicServices = new TopicServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await topicServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
