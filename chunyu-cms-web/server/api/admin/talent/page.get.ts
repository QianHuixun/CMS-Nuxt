import { TalentServices } from '~~/server/services/admin/talent/talent.services';

const talentServices = new TalentServices();

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { pageNum = 1, pageSize = 10, name, organization, researchDirection, status } = query as Record<string, string>;

  const result = await talentServices.pageList({
    pageNum: Number(pageNum),
    pageSize: Number(pageSize),
    name,
    organization,
    researchDirection,
    status
  });

  return createApiResponse(result);
});
