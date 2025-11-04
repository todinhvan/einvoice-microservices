import { AuthorizerResponse } from '../../tcp/authorizer/authorizer-response.interface';

export type VerifyUserTokenGrpcResponse = {
  code: string;
  data: AuthorizerResponse;
  error?: string;
};
