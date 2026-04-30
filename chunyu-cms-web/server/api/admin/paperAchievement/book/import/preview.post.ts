import { readMultipartFormData } from 'h3';
import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find(item => item.name === 'file');
  if (!file) {
    return createApiResponse(null, 400, '未找到导入文件');
  }

  const result = await bookImportServices.previewImport(file);
  return createApiResponse(result);
});
