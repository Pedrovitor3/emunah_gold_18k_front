// Interfaces
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

export interface MultipleUploadResult {
  success: boolean;
  uploads: UploadResult[];
  urls: string[];
  failed?: Array<{ file: File; error: string }>;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  folder?: string;
  maxFiles?: number;
}
