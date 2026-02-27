import { VerifyTokenGrpcRequest } from '../../authorizer/authorizer-request.type';
import { Observable } from 'rxjs';
import { ResponseGRPC } from '../grpc-response.interface';
import { VerifyTokenGrpcResponse } from '../../authorizer/authorizer-response.type';

export interface AuthorizerService {
  verifyToken(request: VerifyTokenGrpcRequest): Observable<ResponseGRPC<VerifyTokenGrpcResponse>>;
}
