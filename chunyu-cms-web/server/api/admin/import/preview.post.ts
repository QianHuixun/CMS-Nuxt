import { readMultipartFormData } from 'h3';
import { ImportServices } from '~~/server/services/admin/import/import.services';

const importServices = new ImportServices();

export default defineEventHandler(async event => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find(item => item.name === 'file');
  const typeField = formData?.find(item => item.name === 'type');
  const type = typeField?.data ? Buffer.from(typeField.data).toString('utf8') : '';

  if (!file) {
    return createApiResponse(null, 400, '未找到上传文件');
  }

  const result = await importServices.preview(type, file);
  return createApiResponse(result);
});
