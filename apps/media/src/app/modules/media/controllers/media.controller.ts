import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@shared/interceptors/tcp-logging.interceptor';
import { MediaService } from '../services/media.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpMessages } from '@shared/constants/enums/tcp-message.enum';
import { RequestParams } from '@shared/decorators/request-param.decorator';
import { UploadFileTCP } from '@shared/contracts/invoice/invoice-request.type';
import { ResponseTCP } from '@shared/contracts/tcp/tcp-client.interface';
import { HttpMessages } from '@shared/constants/enums/http-message.enum';
import { TcpTracingInterceptor } from '@shared/interceptors/tcp-tracing.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpTracingInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(TcpMessages.MEDIA.UPLOAD_FILE)
  async uploadFile(@RequestParams('data') data: UploadFileTCP) {
    const fileUrl = await this.mediaService.uploadFile(data);
    return ResponseTCP.success(fileUrl);
  }

  @MessagePattern(TcpMessages.MEDIA.DESTROY_FILE)
  async destroyFile(@RequestParams('data') data: string) {
    await this.mediaService.destroyFile(data);
    return ResponseTCP.success(HttpMessages.OK);
  }
}
