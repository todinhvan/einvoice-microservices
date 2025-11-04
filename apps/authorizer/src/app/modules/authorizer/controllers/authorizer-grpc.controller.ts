import { Controller } from '@nestjs/common';
import { AuthorizerService } from '../services/authorizer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { VerifyUserTokenGrpcRequest } from '@common/interfaces/grpc/authorizer';
import { VerifyUserTokenGrpcResponse } from '@common/interfaces/grpc/authorizer/authorizer-response.dto';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { AuthorizerResponse } from '@common/interfaces/tcp/authorizer';

@Controller()
export class AuthorizerGrpcController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @GrpcMethod('AuthorizerService', 'verifyUserToken')
  async verifyUserToken(params: VerifyUserTokenGrpcRequest): Promise<VerifyUserTokenGrpcResponse> {
    const result = await this.authorizerService.verifyUserToken(params.token, params.processId);
    return Response.success<AuthorizerResponse>(result);
  }
}
