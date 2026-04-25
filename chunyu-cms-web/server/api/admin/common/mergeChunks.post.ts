import { readBody } from 'h3';
import { createApiResponse } from '~~/server/utils/apiResponse';
import { UploadServices } from '~~/server/services/admin/common/upload.services';

const uploadServices = new UploadServices();

export default defineEventHandler(async event => {
  const body = await readBody<{ fileId?: string; fileName?: string }>(event);
  const result = await uploadServices.mergeChunks(body?.fileId || '', body?.fileName || '');
  return createApiResponse(result);
});
