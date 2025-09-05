// src/services/imageService.ts

import { apiClient } from './baseService/axiosConfig';

export interface UploadImageInput {
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Upload de arquivo único
export const uploadFileToStorage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 segundos
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao fazer upload do arquivo');
    }

    return response.data.data.url;
  } catch (error: any) {
    console.error('Erro no upload do arquivo:', error);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout no upload - arquivo muito grande ou conexão lenta');
    }

    if (error.response?.status === 413) {
      throw new Error('Arquivo muito grande (máximo 5MB)');
    }

    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Arquivo inválido');
    }

    throw new Error(error.response?.data?.error || 'Erro ao fazer upload do arquivo');
  }
};

// Upload múltiplo de arquivos
export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadFileToStorage(file));
  return Promise.all(uploadPromises);
};

// Criar registro de imagem no banco
export const createProductImage = async (imageData: UploadImageInput): Promise<ProductImage> => {
  try {
    const response = await apiClient.post('/images', imageData);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao salvar imagem');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Erro ao criar imagem:', error);
    throw new Error(error.response?.data?.error || 'Erro ao salvar imagem no banco');
  }
};

// Criar múltiplas imagens
export const uploadProductImages = async (images: UploadImageInput[]): Promise<ProductImage[]> => {
  const createPromises = images.map((image) => createProductImage(image));
  return Promise.all(createPromises);
};

// Buscar imagens de um produto
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    const response = await apiClient.get(`/images/product/${productId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao buscar imagens');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Erro ao buscar imagens:', error);
    throw new Error(error.response?.data?.error || 'Erro ao buscar imagens');
  }
};

// Deletar imagem
export const deleteProductImage = async (imageId: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/images/${imageId}`);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao deletar imagem');
    }
  } catch (error: any) {
    console.error('Erro ao deletar imagem:', error);
    throw new Error(error.response?.data?.error || 'Erro ao deletar imagem');
  }
};

// Reordenar imagens
export const reorderProductImages = async (
  productId: string,
  images: { id: string; sort_order: number }[]
): Promise<void> => {
  try {
    const response = await apiClient.put('/images/reorder', {
      product_id: productId,
      images,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao reordenar imagens');
    }
  } catch (error: any) {
    console.error('Erro ao reordenar imagens:', error);
    throw new Error(error.response?.data?.error || 'Erro ao reordenar imagens');
  }
};
