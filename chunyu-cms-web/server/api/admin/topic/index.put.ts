import { TopicServices } from '~~/server/services/admin/topic/topic.services';

const topicServices = new TopicServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await topicServices.update(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
