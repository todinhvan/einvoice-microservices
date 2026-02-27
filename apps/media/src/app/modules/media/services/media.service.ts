import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { UploadFileTCP } from '@shared/contracts/invoice/invoice-request.type';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(data: UploadFileTCP) {
    const fileBuffer = Buffer.from(data.fileBase64, 'base64');
    return await this.cloudinaryService.uploadFile(fileBuffer, data.fileName);
  }

  async destroyFile(publicId: string) {
    return await this.cloudinaryService.destroyFile(publicId);
  }
}
