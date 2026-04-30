import { readMultipartFormData } from 'h3';
import { ObjectStorageServices } from '~~/server/services/admin/paperAchievement/objectStorage.services';

export default defineEventHandler(async event => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find(item => item.name === 'file');
  const folderField = formData?.find(item => item.name === 'folder');
  const folder = folderField?.data ? Buffer.from(folderField.data).toString('utf8') : 'books';

  if (!file) {
    return createApiResponse(null, 400, '未找到上传文件');
  }

  const result = await new ObjectStorageServices().uploadFile(file, folder);
  return createApiResponse(result);
});
