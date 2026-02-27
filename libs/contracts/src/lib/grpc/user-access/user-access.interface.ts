import { GetUserByKeycloakUserIdGrpcRequest } from '../../user-access/user/user-request.type';
import { Observable } from 'rxjs';
import { ResponseGRPC } from '../grpc-response.interface';
import { UserGrpcResponse } from '../../user-access/user/user-response.type';

export interface UserAccessService {
  getUserByKeycloakUserId(request: GetUserByKeycloakUserIdGrpcRequest): Observable<ResponseGRPC<UserGrpcResponse>>;
}
