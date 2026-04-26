import { PatentServices } from '~~/server/services/admin/patent/patent.services';

const patentServices = new PatentServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await patentServices.add(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
