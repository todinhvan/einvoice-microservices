import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GetUserInfoGrpcRequest, GetUserInfoGrpcResponse } from '@common/interfaces/grpc/user';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { User } from '@common/schemas/user.schema';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'getUserInfo')
  async getByUserId(params: GetUserInfoGrpcRequest): Promise<GetUserInfoGrpcResponse> {
    const user = await this.userService.getByUserId(params.token);
    return Response.success<User>(user);
  }
}
