import { createHash, createHmac, randomUUID } from 'crypto';
import { basename, extname, join } from 'path';
import type { MultiPartData } from 'h3';

interface StorageConfig {
  provider: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  forcePathStyle: boolean;
}

interface ObjectUploadResult {
  storageProvider: string;
  objectBucket: string;
  objectKey: string;
  objectUrl: string;
  objectEtag: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export class ObjectStorageServices {
  private readonly config: StorageConfig;

  constructor() {
    const runtimeConfig = useRuntimeConfig();
    const storage = (runtimeConfig as any).objectStorage || {};
    this.config = {
      provider: String(storage.provider || 'rustfs'),
      endpoint: String(storage.endpoint || '').replace(/\/+$/, ''),
      region: String(storage.region || 'us-east-1'),
      accessKeyId: String(storage.accessKeyId || ''),
      secretAccessKey: String(storage.secretAccessKey || ''),
      bucket: String(storage.bucket || ''),
      forcePathStyle: storage.forcePathStyle !== false
    };
  }

  async uploadFile(file: MultiPartData, folder = 'books'): Promise<ObjectUploadResult> {
    if (!file?.data?.length) {
      throw createError({ statusCode: 400, statusMessage: '未选择上传文件' });
    }

    this.assertConfigured();
    const fileName = file.filename || 'book.bin';
    const extension = this.resolveExtension(fileName);
    const objectKey = this.buildObjectKey(folder, extension);
    const mimeType = file.type || this.resolveMimeType(extension);
    const { url, etag } = await this.putObject(objectKey, Buffer.from(file.data), mimeType);

    return {
      storageProvider: this.config.provider,
      objectBucket: this.config.bucket,
      objectKey,
      objectUrl: url,
      objectEtag: etag,
      fileName: basename(fileName),
      fileSize: file.data.length,
      mimeType
    };
  }

  getAccessUrl(objectKey: string, bucket = this.config.bucket) {
    if (!objectKey) {
      throw createError({ statusCode: 400, statusMessage: '缺少对象Key' });
    }
    this.assertEndpoint();

    return {
      storageProvider: this.config.provider,
      objectBucket: bucket,
      objectKey,
      objectUrl: this.buildObjectUrl(objectKey, bucket),
      expiresIn: 0
    };
  }

  private async putObject(objectKey: string, body: Buffer, contentType: string) {
    const now = new Date();
    const amzDate = this.formatAmzDate(now);
    const shortDate = amzDate.slice(0, 8);
    const payloadHash = this.sha256(body);
    const url = new URL(this.buildObjectUrl(objectKey));
    const headers: Record<string, string> = {
      host: url.host,
      'content-length': String(body.length),
      'content-type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate
    };
    headers.authorization = this.buildAuthorizationHeader('PUT', url.pathname, headers, payloadHash, shortDate);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: body as any
    });

    if (!response.ok) {
      const message = await response.text().catch(() => '');
      throw createError({
        statusCode: 502,
        statusMessage: `对象存储上传失败：${response.status} ${message || response.statusText}`
      });
    }

    return {
      url: url.toString(),
      etag: response.headers.get('etag')?.replace(/"/g, '') || ''
    };
  }

  private buildAuthorizationHeader(
    method: string,
    canonicalUri: string,
    headers: Record<string, string>,
    payloadHash: string,
    shortDate: string
  ) {
    const signedHeaders = Object.keys(headers)
      .map(key => key.toLowerCase())
      .sort()
      .join(';');
    const canonicalHeaders = Object.keys(headers)
      .map(key => key.toLowerCase())
      .sort()
      .map(key => `${key}:${headers[key].trim()}\n`)
      .join('');
    const canonicalRequest = [method, canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
    const credentialScope = `${shortDate}/${this.config.region}/s3/aws4_request`;
    const stringToSign = ['AWS4-HMAC-SHA256', headers['x-amz-date'], credentialScope, this.sha256(canonicalRequest)].join('\n');
    const signature = this.hmacHex(this.getSigningKey(shortDate), stringToSign);

    return [
      `AWS4-HMAC-SHA256 Credential=${this.config.accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');
  }

  private getSigningKey(shortDate: string) {
    const kDate = this.hmacBuffer(`AWS4${this.config.secretAccessKey}`, shortDate);
    const kRegion = this.hmacBuffer(kDate, this.config.region);
    const kService = this.hmacBuffer(kRegion, 's3');
    return this.hmacBuffer(kService, 'aws4_request');
  }

  private buildObjectUrl(objectKey: string, bucket = this.config.bucket) {
    this.assertEndpoint();
    const endpoint = new URL(this.config.endpoint);
    const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');

    if (this.config.forcePathStyle) {
      return `${endpoint.origin}/${encodeURIComponent(bucket)}/${encodedKey}`;
    }

    return `${endpoint.protocol}//${bucket}.${endpoint.host}/${encodedKey}`;
  }

  private buildObjectKey(folder: string, extension: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'books';
    return join(cleanFolder, String(year), month, `${Date.now()}_${randomUUID()}.${extension}`).replace(/\\/g, '/');
  }

  private resolveExtension(filename: string) {
    return extname(filename).replace(/^\./, '').toLowerCase() || 'bin';
  }

  private resolveMimeType(extension: string) {
    const mimeMap: Record<string, string> = {
      pdf: 'application/pdf',
      epub: 'application/epub+zip',
      mobi: 'application/x-mobipocket-ebook',
      azw3: 'application/vnd.amazon.ebook',
      txt: 'text/plain',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return mimeMap[extension.toLowerCase()] || 'application/octet-stream';
  }

  private assertConfigured() {
    this.assertEndpoint();
    if (!this.config.bucket || !this.config.accessKeyId || !this.config.secretAccessKey) {
      throw createError({ statusCode: 500, statusMessage: '对象存储未配置完整，请配置 Bucket、AccessKey 和 SecretKey' });
    }
  }

  private assertEndpoint() {
    if (!this.config.endpoint) {
      throw createError({ statusCode: 500, statusMessage: '对象存储 Endpoint 未配置' });
    }
  }

  private formatAmzDate(date: Date) {
    return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  }

  private sha256(value: Buffer | string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private hmacBuffer(key: string | Buffer, value: string) {
    return createHmac('sha256', key).update(value).digest();
  }

  private hmacHex(key: string | Buffer, value: string) {
    return createHmac('sha256', key).update(value).digest('hex');
  }
}
