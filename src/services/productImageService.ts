import type { AxiosResponse } from 'axios';
import { apiClient } from './baseService/axiosConfig';

interface UploadImageInput {
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export const uploadProductImages = async (images: UploadImageInput[]) => {
  try {
    const response: AxiosResponse = await apiClient.post('/images', images);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao enviar imagens');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('erro ao enviar imagens', error);
    throw new Error('Erro ao enviar imagens');
  }
};
