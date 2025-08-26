import type { AxiosResponse } from 'axios';
import type { ApiResponse, User } from '../types';
import { apiClient } from './baseService/axiosConfig';

export const getProfile = async (): Promise<User> => {
  const response: AxiosResponse<ApiResponse<User>> = await apiClient.get('/auth/profile');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Erro ao buscar perfil');
  }

  return response.data.data;
};
