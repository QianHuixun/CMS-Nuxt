import { TopicSpaceTimeServices } from '~~/server/services/admin/talent/topicSpaceTime.services';

const topicSpaceTimeServices = new TopicSpaceTimeServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, title, keyword, topicNo, level, researchStatus, leader, year, status } = query as any;

  const result = await topicSpaceTimeServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    title,
    keyword,
    topicNo,
    level,
    researchStatus,
    leader,
    year,
    status
  });

  return createApiResponse(result);
});
