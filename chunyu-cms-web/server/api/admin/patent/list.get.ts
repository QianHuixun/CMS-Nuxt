import { PatentServices } from '~~/server/services/admin/patent/patent.services';

const patentServices = new PatentServices();

export default defineEventHandler(async () => {
  const result = await patentServices.list();
  return createApiResponse(result);
});
