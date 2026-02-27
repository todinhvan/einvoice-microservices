import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetUserByKeycloakUserIdGrpcRequest } from '@shared/contracts/user-access/user/user-request.type';
import { UserService } from '../services/user.service';
import { ResponseGRPC } from '@shared/contracts/grpc/grpc-response.interface';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getUserByKeycloakUserId')
  async getUserByKeycloakUserId(params: GetUserByKeycloakUserIdGrpcRequest) {
    const user = await this.userService.getUserByKeycloakUserId(params.keycloakUserId);
    return ResponseGRPC.success(user);
  }
}
