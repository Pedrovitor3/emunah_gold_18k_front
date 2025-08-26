import type { AxiosResponse } from 'axios';
import type { ApiResponse, Category } from '../types';
import { apiClient } from './baseService/axiosConfig';
import type { ProductInterface } from '../interface/ProductInterface';

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.featured) queryParams.append('featured', 'true');
  if (params?.search) queryParams.append('search', params.search);

  const response: AxiosResponse = await apiClient.get(`/products?${queryParams.toString()}`);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Erro ao buscar produtos');
  }

  const productData = response.data || [];

  return productData;
};

export const getProductById = async (id: string): Promise<ProductInterface> => {
  const response: AxiosResponse<ApiResponse<ProductInterface>> = await apiClient.get(
    `/products/${id}`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Produto não encontrado');
  }

  return response.data.data;
};

export const getFeaturedProducts = async (limit?: number): Promise<ProductInterface[]> => {
  const queryParams = limit ? `?limit=${limit}` : '';
  const response: AxiosResponse<ApiResponse<ProductInterface[]>> = await apiClient.get(
    `/products/featured${queryParams}`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Erro ao buscar produtos em destaque');
  }

  return response.data.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response: AxiosResponse<ApiResponse<Category[]>> =
    await apiClient.get('/products/categories');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Erro ao buscar categorias');
  }

  return response.data.data;
};
