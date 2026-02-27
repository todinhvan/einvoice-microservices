import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@shared/constants/enums/metadata-key.enum';
import { Request } from 'express';
import { getAccessToken, setAuthorizedMetadata } from '@shared/utils/request.util';
import { ErrorMessages } from '@shared/constants/enums/error-message.enum';
import { TcpServices } from '@shared/constants/enums/tcp-service.enum';
import { TcpClient } from '@shared/contracts/tcp/tcp-client.interface';
import { AuthorizedMetadata } from '@shared/contracts/authorizer/authorizer-response.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateCacheToken } from '@shared/utils/string.util';
import { GrpcServices } from '@shared/constants/enums/grpc-service.enum';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthorizerService } from '@shared/contracts/grpc/authorizer/authorizer.interface';

@Injectable()
export class UserGuard implements CanActivate {
  private logger = new Logger(UserGuard.name);
  private authorizerService: AuthorizerService;
  constructor(
    private reflector: Reflector,
    @Inject(TcpServices.AUTHORIZER) private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(GrpcServices.AUTHORIZER) private readonly authorizerGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authorizerService = this.authorizerGrpcClient.getService<AuthorizerService>('AuthorizerService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { [MetadataKeys.PROCESS_ID]: string } = context.switchToHttp().getRequest();
    const authorizationData = this.reflector.get<{ [MetadataKeys.SECURED]: boolean }>(
      MetadataKeys.SECURED,
      context.getHandler(),
    );
    if (!authorizationData || !authorizationData[MetadataKeys.SECURED]) {
      return true;
    }

    const token = getAccessToken(request);
    Logger.log(`Token: ${token}`);
    if (!token) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    const cacheToken = generateCacheToken(token);
    const authorizedData = (await this.cacheManager.get(cacheToken)) as AuthorizedMetadata | undefined;
    if (authorizedData) {
      Logger.log('Data from cache');
      setAuthorizedMetadata(request, authorizedData);
      return true;
    }

    const processId = request[MetadataKeys.PROCESS_ID];
    const authorizerResponse = await this.verifyToken(token, processId);
    if (!authorizerResponse || authorizerResponse.valid === false || !authorizerResponse.metadata) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }

    setAuthorizedMetadata(request, authorizerResponse.metadata);
    this.cacheManager.set(cacheToken, authorizerResponse.metadata);
    Logger.log('Data from authorizer');
    return true;
  }

  private async verifyToken(token: string, processId: string) {
    try {
      // return await firstValueFrom(
      //   this.authorizerClient
      //     .send<AuthorizerResponse, string>(TcpMessages.AUTHORIZER.VERIFY_TOKEN, { processId, data: token })
      //     .pipe(map((response) => response.data)),
      // );
      return await firstValueFrom(
        this.authorizerService.verifyToken({ token, processId }).pipe(map((response) => response.data)),
      );
    } catch {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED);
    }
  }
}
