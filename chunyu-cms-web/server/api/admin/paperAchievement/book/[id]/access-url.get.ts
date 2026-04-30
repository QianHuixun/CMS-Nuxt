import { BookImportServices } from '~~/server/services/admin/paperAchievement/bookImport.services';
import { ObjectStorageServices } from '~~/server/services/admin/paperAchievement/objectStorage.services';

const bookImportServices = new BookImportServices();

export default defineEventHandler(async event => {
  const id = Number(getRouterParam(event, 'id'));
  const book = await bookImportServices.getById(id);
  const result = book.objectKey
    ? new ObjectStorageServices().getAccessUrl(book.objectKey, book.objectBucket || undefined)
    : {
        storageProvider: book.storageProvider || 'rustfs',
        objectBucket: book.objectBucket || '',
        objectKey: '',
        objectUrl: book.objectUrl || '',
        expiresIn: 0
      };

  return createApiResponse(result);
});
