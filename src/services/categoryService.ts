import type { AxiosResponse } from 'axios';
import { apiClient } from './baseService/axiosConfig';

export const getCategories = async () => {
  const response: AxiosResponse = await apiClient.get(`/category`);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Erro ao buscar categorias');
  }

  const categoriesData = response.data || [];

  return categoriesData;
};
