import { Observable } from 'rxjs';
import { GetUserInfoGrpcResponse } from './user-response.dto';

export type GetUserInfoGrpcRequest = {
  token: string;
};

export interface UserService {
  getUserInfo(request: GetUserInfoGrpcRequest): Observable<GetUserInfoGrpcResponse>;
}
