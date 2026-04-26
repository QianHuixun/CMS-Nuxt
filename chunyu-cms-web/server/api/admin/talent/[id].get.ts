import { TalentServices } from '~~/server/services/admin/talent/talent.services';

const talentServices = new TalentServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await talentServices.getById(id);
  return createApiResponse(result);
});
