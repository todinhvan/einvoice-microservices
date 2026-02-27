import { LoginRequestDTO } from '@shared/contracts/authorizer/authorizer-request.type';
import { CreateUserRequestDTO } from '@shared/contracts/user-access/user/user-request.type';
import { ADMIN_ROLE } from '@shared/constants/enums/role.enum';
import axios from 'axios';
import { ResponseDTO } from '@shared/contracts/gateway/response.dto';
import { UserResponse } from '@shared/contracts/user-access/user/user-response.type';
import { LoginResponse } from '@shared/contracts/authorizer/authorizer-response.type';
import { Logger } from '@nestjs/common';

export const getAccessToken = async () => {
  const baseEmail = 'lorkent24@gmail.com';
  const basePassword = '1234';

  try {
    return await login(baseEmail, basePassword);
  } catch {
    Logger.log(`User not found with email ${baseEmail}, creating...`);
    const createUserDTO: CreateUserRequestDTO = {
      email: baseEmail,
      firstName: 'Test',
      lastName: 'Integration',
      password: basePassword,
      roleIds: [ADMIN_ROLE],
    };
    await axios.post<ResponseDTO<UserResponse>>('/users', createUserDTO);

    Logger.log('User created');
    Logger.log('Logging in...');
    return await login(baseEmail, basePassword);
  }
};

const login = async (email: string, password: string) => {
  const loginDTO: LoginRequestDTO = {
    email,
    password,
  };
  const loginResponse = await axios.post<ResponseDTO<LoginResponse>>('/authorizer/login', loginDTO);

  Logger.log('Logged in');
  return {
    accessToken: loginResponse.data.data.accessToken,
    clientEmail: email,
  };
};
