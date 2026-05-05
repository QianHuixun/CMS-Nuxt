import { ResearchToolServices } from '~~/server/services/admin/coreResource/researchTool.services';

const researchToolServices = new ResearchToolServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await researchToolServices.add(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
