import { ResearchToolServices } from '~~/server/services/admin/coreResource/researchTool.services';

const researchToolServices = new ResearchToolServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const result = await researchToolServices.getById(id);
  return createApiResponse(result);
});
