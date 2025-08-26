import type { AxiosResponse } from 'axios';
import type { ApiResponse, RegisterData, User } from '../types';
import { apiClient } from './baseService/axiosConfig';

export const loginService = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await apiClient.post(
    '/auth/login',
    { email, password }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Erro no login');
  }
  return response.data.data;
};

export const registerService = async (
  userData: RegisterData
): Promise<{ user: User; token: string }> => {
  const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await apiClient.post(
    '/auth/register',
    userData
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Erro no registro');
  }

  return response.data.data;
};
