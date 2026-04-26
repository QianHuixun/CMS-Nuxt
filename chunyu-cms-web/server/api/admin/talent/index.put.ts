import { TalentServices } from '~~/server/services/admin/talent/talent.services';

const talentServices = new TalentServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await talentServices.update(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
