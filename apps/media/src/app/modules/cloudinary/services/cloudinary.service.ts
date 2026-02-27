/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { UploadFileResponse } from '@shared/contracts/media/media-response.type';

@Injectable()
export class CloudinaryService {
  private cloudinary = cloudinary;

  constructor(private readonly configService: ConfigService) {
    this.cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CONFIG.CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_CONFIG.API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_CONFIG.API_SECRET'),
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<UploadFileResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'media-for-einvoice',
          resource_type: 'auto',
          public_id: fileName,
        },
        (error, result) => {
          if (error) {
            Logger.log(`Upload error: ${error}`);
            return reject(error);
          } else {
            return resolve({
              fileUrl: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  async destroyFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          Logger.log(`Delete error: ${error}`);
          return reject(error);
        } else {
          Logger.log(`Delete result: ${result}`);
          return resolve();
        }
      });
    });
  }
}
