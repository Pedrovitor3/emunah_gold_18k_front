// src/services/uploadService.ts
import type {
  MultipleUploadResult,
  UploadOptions,
  UploadResult,
} from '../interface/UploadInterface';
import { apiClient } from './baseService/axiosConfig';

// Validações no frontend
const validateFile = (file: File): void => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo de arquivo não permitido: ${file.type}. Use: JPEG, PNG, WebP`);
  }

  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`Arquivo muito grande: ${sizeMB}MB. Tamanho máximo: 5MB.`);
  }

  if (file.size === 0) {
    throw new Error('Arquivo está vazio.');
  }
};

// Upload único de arquivo via backend
export const uploadFileToBackend = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const { onProgress, folder = 'products' } = options;

  try {
    // Validar arquivo no frontend
    validateFile(file);

    // Criar FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Configurar requisição com progresso
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    };

    // Fazer upload para o backend
    const response = await apiClient.post('/upload/single', formData, config);

    if (response.data.success) {
      return {
        success: true,
        url: response.data.url,
        filename: response.data.filename,
        originalName: response.data.originalName,
        size: response.data.size,
      };
    } else {
      throw new Error(response.data.message || 'Erro no upload');
    }
  } catch (error: any) {
    console.error('Erro no upload:', error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error instanceof Error ? error.message : 'Erro desconhecido no upload');
  }
};

// Upload múltiplo via backend
export const uploadMultipleFilesToBackend = async (
  files: File[],
  options: UploadOptions = {}
): Promise<MultipleUploadResult> => {
  const { onProgress, folder = 'products', maxFiles = 5 } = options;

  if (!files || files.length === 0) {
    throw new Error('Nenhum arquivo fornecido para upload');
  }

  if (files.length > maxFiles) {
    throw new Error(`Máximo de ${maxFiles} arquivos permitidos`);
  }

  try {
    // Validar todos os arquivos primeiro
    files.forEach((file, index) => {
      try {
        validateFile(file);
      } catch (error) {
        throw new Error(
          `Arquivo ${index + 1} (${file.name}): ${error instanceof Error ? error.message : 'Erro na validação'}`
        );
      }
    });

    // Criar FormData com múltiplos arquivos
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('folder', folder);

    // Configurar requisição
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    };

    // Fazer upload para o backend
    const response = await apiClient.post('/upload/multiple', formData, config);

    if (response.data.success) {
      return {
        success: true,
        uploads: response.data.uploads,
        urls: response.data.uploads.map((upload: UploadResult) => upload.url),
        ...(response.data.failed &&
          response.data.failed.length > 0 && {
            failed: response.data.failed,
          }),
      };
    } else {
      throw new Error(response.data.message || 'Erro no upload múltiplo');
    }
  } catch (error: any) {
    console.error('Erro no upload múltiplo:', error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error instanceof Error ? error.message : 'Erro desconhecido no upload');
  }
};

// Upload específico para produtos
export const uploadProductImages = async (
  imageFiles: File[],
  productName: string = ''
): Promise<string[]> => {
  try {
    if (!imageFiles || imageFiles.length === 0) {
      return [];
    }

    const result = await uploadMultipleFilesToBackend(imageFiles, {
      folder: 'products',
      maxFiles: 5,
    });

    if (result.failed && result.failed.length > 0) {
      console.warn('Alguns uploads falharam:', result.failed);

      // Ainda retorna as URLs que deram certo
      if (result.urls.length === 0) {
        throw new Error('Todos os uploads falharam');
      }
    }

    return result.urls;
  } catch (error) {
    console.error('Erro no upload das imagens do produto:', error);
    throw error;
  }
};

// Upload com retry
export const uploadWithRetry = async (
  file: File,
  maxRetries: number = 3,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFileToBackend(file, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Erro desconhecido');
      console.warn(`Upload falhou (tentativa ${attempt}/${maxRetries}):`, lastError.message);

      if (attempt < maxRetries) {
        // Aguardar antes da próxima tentativa
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

// Deletar arquivo via backend
export const deleteFile = async (filename: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/upload/${filename}`);
    return response.data.success;
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return false;
  }
};

// Obter informações de um arquivo
export const getFileInfo = async (filename: string) => {
  try {
    const response = await apiClient.get(`/upload/info/${filename}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter informações do arquivo:', error);
    throw error;
  }
};
