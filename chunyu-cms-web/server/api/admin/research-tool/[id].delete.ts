import { ResearchToolServices } from '~~/server/services/admin/coreResource/researchTool.services';

const researchToolServices = new ResearchToolServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  await researchToolServices.delete(id, event.context.user?.userName || 'system');
  return createApiResponse(null);
});
