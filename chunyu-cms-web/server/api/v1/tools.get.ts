import { ResearchToolServices } from '~~/server/services/admin/coreResource/researchTool.services';

const researchToolServices = new ResearchToolServices();

export default defineEventHandler(async () => {
  const result = await researchToolServices.publicList();
  return createApiResponse(result);
});
