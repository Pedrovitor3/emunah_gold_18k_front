import type { AxiosResponse } from 'axios';
import { apiClient } from './baseService/axiosConfig';
<<<<<<< HEAD

interface CreateProductData {
  category_id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  weight?: number;
  gold_purity?: string;
  stock_quantity?: number;
  is_active?: boolean;
  featured?: boolean;
}

interface UpdateProductData extends Partial<CreateProductData> {
  id?: string;
}

// Criar produto (simplificado)
export const createProduct = async (productData: CreateProductData) => {
  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
=======
import type { ProductInterface } from '../interface/ProductInterface';
interface ProductData {
  category_id: string;
  name: string;
  price: number;
  description?: string;
  sku?: string;
  weight?: number;
  gold_purity?: string;
  stock_quantity?: number;
  is_active?: boolean;
  featured?: boolean;
}

export const createProduct = async (data: ProductData) => {
  try {
    const response: AxiosResponse = await apiClient.post('/products', data);
>>>>>>> a82c04f5f15be514a6e201a1af11c8f2e31d64f5

    // Tratar diferentes tipos de erro
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error.response?.data?.errors) {
      // Se há erros de validação específicos
      const validationErrors = Object.values(error.response.data.errors).flat();
      throw new Error(validationErrors.join(', '));
    }

    throw new Error(error.message || 'Erro ao criar produto');
  }
};

// Atualizar produto
export const updateProduct = async (productId: string, productData: UpdateProductData) => {
  try {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat();
      throw new Error(validationErrors.join(', '));
    }

    throw new Error(error.message || 'Erro ao atualizar produto');
  }
};

// Buscar produtos
export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category_id?: string;
  search?: string;
  is_active?: boolean;
  featured?: boolean;
}) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar produtos');
  }
};

// Buscar produto por ID
export const getProduct = async (id: string) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar produto');
  }
};

// Deletar produto
export const deleteProduct = async (id: string) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    throw new Error(error.response?.data?.message || 'Erro ao deletar produto');
  }
};

// Deletar imagem específica do produto
export const deleteProductImage = async (productId: string, imageId: string) => {
  try {
    const response = await apiClient.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error(error.response?.data?.message || 'Erro ao deletar imagem');
  }
};

// Reordenar imagens do produto
export const reorderProductImages = async (
  productId: string,
  imageOrders: Array<{ id: string; order: number }>
) => {
  try {
    const response = await apiClient.put(`/products/${productId}/images/reorder`, {
      imageOrders,
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao reordenar imagens:', error);
    throw new Error(error.response?.data?.message || 'Erro ao reordenar imagens');
  }
};

// Validar SKU
export const validateSKU = async (sku: string, excludeProductId?: string) => {
  try {
    const response = await apiClient.post('/products/validate-sku', {
      sku,
      excludeProductId,
    });
    return response.data.isAvailable;
  } catch (error: any) {
    console.error('Erro ao validar SKU:', error);
    return false;
  }
};

// Buscar produtos por categoria
export const getProductsByCategory = async (categoryId: string) => {
  try {
    const response = await apiClient.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar produtos da categoria:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar produtos da categoria');
  }
};

// Buscar produtos em destaque
export const getFeaturedProducts = async (limit: number = 10) => {
  try {
    const response = await apiClient.get('/products/featured', {
      params: { limit },
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar produtos em destaque:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar produtos em destaque');
  }
};

export const getProductById = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Produto não encontrado');
  }

  return response.data.data;
};
