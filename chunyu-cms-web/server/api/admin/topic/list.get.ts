import { TopicServices } from '~~/server/services/admin/topic/topic.services';

const topicServices = new TopicServices();

export default defineEventHandler(async () => {
  const result = await topicServices.list();
  return createApiResponse(result);
});
