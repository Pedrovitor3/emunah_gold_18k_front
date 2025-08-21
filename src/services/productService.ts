import type { AxiosResponse } from "axios";
import type { ApiResponse, Category, PaginatedResponse, Product } from "../types";
import { apiClient } from "./baseService/axiosConfig";

 export const getProducts=async(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Product>> =>{
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.search) queryParams.append('search', params.search);

    const response: AxiosResponse<PaginatedResponse<Product>> = 
      await apiClient.get(`/products?${queryParams.toString()}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao buscar produtos');
    }
    
    return response.data;
  }

  export const getProductById =async(id: string): Promise<Product> =>{
    const response: AxiosResponse<ApiResponse<Product>> = 
      await apiClient.get(`/products/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Produto não encontrado');
    }
    
    return response.data.data;
  }

   export const getFeaturedProducts =async(limit?: number): Promise<Product[]> =>{
    const queryParams = limit ? `?limit=${limit}` : '';
    const response: AxiosResponse<ApiResponse<Product[]>> = 
      await apiClient.get(`/products/featured${queryParams}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar produtos em destaque');
    }
    
    return response.data.data;
  }

   export const  getCategories =async(): Promise<Category[]> => {
    const response: AxiosResponse<ApiResponse<Category[]>> = 
      await apiClient.get('/products/categories');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar categorias');
    }
    
    return response.data.data;
  }