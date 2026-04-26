import { TalentServices } from '~~/server/services/admin/talent/talent.services';

const talentServices = new TalentServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await talentServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
