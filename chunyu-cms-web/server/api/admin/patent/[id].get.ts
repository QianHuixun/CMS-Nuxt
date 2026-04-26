import { PatentServices } from '~~/server/services/admin/patent/patent.services';

const patentServices = new PatentServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await patentServices.getById(id);
  return createApiResponse(result);
});
