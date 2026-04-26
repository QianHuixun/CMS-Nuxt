import { ImportServices } from '~~/server/services/admin/import/import.services';

const importServices = new ImportServices();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const result = await importServices.confirm(body?.type, body?.rows, event.context.user?.userName || 'system');
  return createApiResponse(result);
});
