import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { extname } from 'path';
import { createError, defineEventHandler, sendStream, setHeader } from 'h3';
import { isWithinUploadRoot, resolveUploadCandidates } from '~~/server/utils/uploads';

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm'
};

export default defineEventHandler(async event => {
  const requestPath = event.path.split('?')[0];
  if (!requestPath.startsWith('/uploads/')) {
    return;
  }

  const relativePath = decodeURIComponent(requestPath.replace(/^\/uploads\//, ''));
  const candidates = resolveUploadCandidates(relativePath);

  try {
    for (const candidate of candidates) {
      if (!isWithinUploadRoot(candidate.filePath, candidate.root)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
      }

      try {
        const fileStat = await stat(candidate.filePath);
        if (!fileStat.isFile()) {
          continue;
        }

        setHeader(
          event,
          'Content-Type',
          mimeTypes[extname(candidate.filePath).toLowerCase()] || 'application/octet-stream'
        );
        setHeader(event, 'Content-Length', String(fileStat.size));
        setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
        return sendStream(event, createReadStream(candidate.filePath));
      } catch (error: any) {
        if (error?.statusCode) {
          throw error;
        }
      }
    }
  } catch (error: any) {
    if (error?.statusCode) {
      throw error;
    }
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }
});
