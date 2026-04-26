import { PaperServices } from '~~/server/services/admin/paper/paper.services';

const paperServices = new PaperServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await paperServices.add(body, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
