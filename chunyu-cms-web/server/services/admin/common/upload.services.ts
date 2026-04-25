import { join, extname, basename, dirname } from 'path';
import { writeFile, readFile } from 'fs/promises';
import fs from 'fs-extra';
import { imageSize } from 'image-size';
import type { MultiPartData } from 'h3';
import { SharedServices } from '~~/server/services/admin/share/shared.services';
import { getUploadRoots } from '~~/server/utils/uploads';

interface UploadFileResult {
  name: string;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

interface MergeChunkResult {
  name: string;
  url: string;
  mimeType: string;
  size: number;
  path: string;
}

interface ChunkPayload {
  file: MultiPartData;
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  fileName: string;
}

export class UploadServices {
  private readonly sharedServices = new SharedServices();
  private readonly runtimeConfig = useRuntimeConfig();

  private get publicUploadsDir() {
    return getUploadRoots(this.runtimeConfig.uploadPath)[0];
  }

  private get mirroredUploadsDirs() {
    return getUploadRoots(this.runtimeConfig.uploadPath).slice(1);
  }

  private get tempUploadsDir() {
    return join(process.cwd(), '.upload-temp');
  }

  async uploadFile(file: MultiPartData, folder?: string): Promise<UploadFileResult> {
    if (!file?.data?.length) {
      throw createError({ statusCode: 400, statusMessage: '未选择上传文件' });
    }

    const targetFolder = folder || (file.type?.startsWith('video/') ? 'videos' : 'images');
    const extension = this.resolveExtension(file.filename, file.type);
    const relativePath = this.buildRelativePath(targetFolder, extension);

    await this.writeUploadTargets(relativePath, file.data);

    const { width, height } = this.getImageMeta(file);
    const url = `${this.runtimeConfig.uploadPath}/${relativePath}`.replace(/\\/g, '/');

    return {
      name: basename(relativePath),
      url,
      mimeType: file.type || this.resolveMimeType(extension),
      width,
      height,
      size: file.data.length
    };
  }

  async saveChunk(payload: ChunkPayload) {
    const { file, fileId, chunkIndex } = payload;
    if (!file?.data?.length) {
      throw createError({ statusCode: 400, statusMessage: '分片文件不能为空' });
    }

    const chunkDir = join(this.tempUploadsDir, fileId);
    await fs.ensureDir(chunkDir);
    await writeFile(join(chunkDir, `${chunkIndex}.part`), file.data);
  }

  async mergeChunks(fileId: string, fileName: string): Promise<MergeChunkResult> {
    if (!fileId || !fileName) {
      throw createError({ statusCode: 400, statusMessage: '缺少合并参数' });
    }

    const chunkDir = join(this.tempUploadsDir, fileId);
    const chunkExists = await fs.pathExists(chunkDir);
    if (!chunkExists) {
      throw createError({ statusCode: 404, statusMessage: '未找到分片文件' });
    }

    const chunkFiles = (await fs.readdir(chunkDir))
      .filter(file => file.endsWith('.part'))
      .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

    if (!chunkFiles.length) {
      throw createError({ statusCode: 400, statusMessage: '分片文件为空' });
    }

    const extension = this.resolveExtension(fileName, '');
    const relativePath = this.buildRelativePath('videos', extension);

    const buffers = [];
    for (const chunkFile of chunkFiles) {
      buffers.push(await readFile(join(chunkDir, chunkFile)));
    }

    const mergedBuffer = Buffer.concat(buffers);
    await this.writeUploadTargets(relativePath, mergedBuffer);
    await fs.remove(chunkDir);

    const url = `${this.runtimeConfig.uploadPath}/${relativePath}`.replace(/\\/g, '/');
    return {
      name: basename(relativePath),
      url,
      mimeType: this.resolveMimeType(extension),
      size: mergedBuffer.length,
      path: savePath
    };
  }

  parseChunkFormData(formData: MultiPartData[] | undefined): ChunkPayload {
    const file = formData?.find(item => item.name === 'file');
    const fileId = this.readTextField(formData, 'fileId');
    const chunkIndex = Number(this.readTextField(formData, 'chunkIndex'));
    const totalChunks = Number(this.readTextField(formData, 'totalChunks'));
    const fileName = this.readTextField(formData, 'fileName');

    if (!file || !fileId || Number.isNaN(chunkIndex) || Number.isNaN(totalChunks) || !fileName) {
      throw createError({ statusCode: 400, statusMessage: '分片上传参数不完整' });
    }

    return {
      file,
      fileId,
      chunkIndex,
      totalChunks,
      fileName
    };
  }

  private buildRelativePath(folder: string, extension: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const randomName = `${Date.now()}_${this.sharedServices.generateRandomValue(8)}.${extension}`;
    return join(folder, String(year), month, randomName);
  }

  private resolveExtension(filename?: string, mimeType?: string | null) {
    const fileExt = extname(filename || '').replace(/^\./, '');
    if (fileExt) return fileExt.toLowerCase();
    const mimeExt = mimeType?.split('/')[1];
    return (mimeExt || 'bin').toLowerCase();
  }

  private resolveMimeType(extension: string) {
    const ext = extension.toLowerCase();
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      webm: 'video/webm'
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  private getImageMeta(file: MultiPartData) {
    if (!file.type?.startsWith('image/')) {
      return { width: 0, height: 0 };
    }
    try {
      const meta = imageSize(Buffer.from(file.data));
      return {
        width: meta.width || 0,
        height: meta.height || 0
      };
    } catch {
      return { width: 0, height: 0 };
    }
  }

  private readTextField(formData: MultiPartData[] | undefined, fieldName: string) {
    const item = formData?.find(entry => entry.name === fieldName);
    return item?.data ? Buffer.from(item.data).toString('utf8') : '';
  }

  private async writeUploadTargets(relativePath: string, data: Buffer) {
    const saveTargets = [this.publicUploadsDir, ...this.mirroredUploadsDirs].map(root => join(root, relativePath));

    await Promise.all(
      saveTargets.map(async savePath => {
        await fs.ensureDir(dirname(savePath));
        await writeFile(savePath, data);
      })
    );
  }
}
