import { ImportServices } from '~~/server/services/admin/import/import.services';

const importServices = new ImportServices();

export default defineEventHandler(async event => {
  const query = getQuery(event) as Record<string, string>;
  const result = await importServices.downloadTemplate(query.type);
  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  setHeader(event, 'Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(result.filename)}`);
  return result.buffer;
});
