import { readMultipartFormData } from 'h3';
import { createApiResponse } from '~~/server/utils/apiResponse';
import { UploadServices } from '~~/server/services/admin/common/upload.services';

const uploadServices = new UploadServices();

export default defineEventHandler(async event => {
  const formData = await readMultipartFormData(event);
  const payload = uploadServices.parseChunkFormData(formData);
  await uploadServices.saveChunk(payload);
  return createApiResponse(null);
});
