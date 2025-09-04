// src/services/productImageService.ts
import type { AxiosResponse } from 'axios';
import { apiClient } from './baseService/axiosConfig';

interface UploadImageInput {
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

// Upload de arquivo para storage (você precisa implementar este endpoint)
export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao fazer upload do arquivo');
    }

    return response.data.data.url; // Retorna a URL do arquivo
  } catch (error: any) {
    console.error('Erro no upload do arquivo:', error);
    throw new Error('Erro ao fazer upload do arquivo');
  }
};

// Criar múltiplas imagens do produto
export const uploadProductImages = async (images: UploadImageInput[]) => {
  try {
    const response: AxiosResponse = await apiClient.post('/images/bulk', { images });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao enviar imagens');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Erro ao enviar imagens:', error);
    throw new Error('Erro ao enviar imagens');
  }
};

// Buscar imagens de um produto
export const getProductImages = async (productId: string) => {
  try {
    const response: AxiosResponse = await apiClient.get(`/images/product/${productId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao buscar imagens');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Erro ao buscar imagens:', error);
    throw new Error('Erro ao buscar imagens');
  }
};

// Atualizar uma imagem
export const updateProductImage = async (imageId: string, data: Partial<UploadImageInput>) => {
  try {
    const response: AxiosResponse = await apiClient.put(`/images/${imageId}`, data);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao atualizar imagem');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Erro ao atualizar imagem:', error);
    throw new Error('Erro ao atualizar imagem');
  }
};

// Deletar uma imagem
export const deleteProductImage = async (imageId: string) => {
  try {
    const response: AxiosResponse = await apiClient.delete(`/images/${imageId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao deletar imagem');
    }

    return response.data;
  } catch (error: any) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error('Erro ao deletar imagem');
  }
};
