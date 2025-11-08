import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { MediaService } from '../services/media.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enums/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE)
  async uploadFile(@RequestParams() params: UploadFileTcpRequest): Promise<Response<string>> {
    const result = await this.mediaService.uploadFileToStorage(params);
    return Response.success<string>(result);
  }
}
