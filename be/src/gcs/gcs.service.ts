import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';

@Injectable()
export class GcsService {
  private readonly logger = new Logger(GcsService.name);
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor() {
    const keyPath = path.resolve(
      process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
    );
    this.bucketName = process.env.GCS_BUCKET_NAME!;

    this.storage = new Storage({
      keyFilename: keyPath,
      projectId: process.env.GCS_PROJECT_ID,
    });

    this.logger.log(`Initialized GCS with bucket: ${this.bucketName}`);
  }

  get bucket() {
    return this.storage.bucket(this.bucketName);
  }

  async uploadFile(file: Express.Multer.File, destFolder = 'uploads') {
    const destination = `${destFolder}/${Date.now()}-${file.originalname}`;
    const blob = this.bucket.file(destination);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      metadata: { cacheControl: 'public, max-age=31536000' },
    });

    return new Promise<string>((resolve, reject) => {
      blobStream.on('error', (err) => {
        this.logger.error('Upload failed', err);
        reject(err);
      });

      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destination}`;
        this.logger.log(`Uploaded: ${publicUrl}`);
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  async uploadBuffer(buffer: Buffer, destination: string) {
    const file = this.bucket.file(destination);
    await file.save(buffer, {
      resumable: false,
      contentType: 'audio/mpeg',
      metadata: { cacheControl: 'public, max-age=31536000' },
    });

    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destination}`;
    const gsUri = `gs://${this.bucketName}/${destination}`;

    this.logger.log(`✅ Uploaded: ${gsUri}`);

    return { publicUrl, gsUri };
  }

  async deleteFile(filePath: string) {
    try {
      await this.bucket.file(filePath).delete();
      this.logger.log(`Deleted file: ${filePath}`);
      return true;
    } catch (err) {
      this.logger.error('Delete failed', err);
      return false;
    }
  }
}
