import { TopicServices } from '~~/server/services/admin/topic/topic.services';

const topicServices = new TopicServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, projectYear, status } = query as Record<string, string>;

  const result = await topicServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    projectYear,
    status
  });

  return createApiResponse(result);
});
