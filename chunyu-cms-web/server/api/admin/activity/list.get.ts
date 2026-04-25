import { ActivityServices } from '~~/server/services/admin/activity/activity.services';

const activityServices = new ActivityServices();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, keyword, isHeadline, status } = query as any;

  const result = await activityServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    keyword,
    isHeadline,
    status
  });

  return createApiResponse(result);
});
