import { readMultipartFormData } from 'h3';
import { createApiResponse } from '~~/server/utils/apiResponse';
import { UploadServices } from '~~/server/services/admin/common/upload.services';

export default defineEventHandler(async event => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find(item => item.name === 'file');
  const folderField = formData?.find(item => item.name === 'folder');
  const folder = folderField?.data ? Buffer.from(folderField.data).toString('utf8') : undefined;
  if (!file) {
    return createApiResponse(null, 400, '未找到上传文件');
  }

  const result = await new UploadServices().uploadFile(file, folder);
  return createApiResponse(result);
});
