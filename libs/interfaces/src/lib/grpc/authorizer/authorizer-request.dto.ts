import { Observable } from 'rxjs';
import { VerifyUserTokenGrpcResponse } from './authorizer-response.dto';

export type VerifyUserTokenGrpcRequest = {
  token: string;
  processId: string;
};

export interface AuthorizerService {
  verifyUserToken(params: VerifyUserTokenGrpcRequest): Observable<VerifyUserTokenGrpcResponse>;
}
