import { Controller } from '@nestjs/common';
import { AuthorizerService } from '../services/authorizer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { VerifyTokenGrpcRequest } from '@shared/contracts/authorizer/authorizer-request.type';
import { ResponseGRPC } from '@shared/contracts/grpc/grpc-response.interface';

@Controller()
export class UserGrpcController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @GrpcMethod('AuthorizerService', 'verifyToken')
  async verifyToken(params: VerifyTokenGrpcRequest) {
    const result = await this.authorizerService.verifyToken(params.token, params.processId);
    return ResponseGRPC.success(result);
  }
}
