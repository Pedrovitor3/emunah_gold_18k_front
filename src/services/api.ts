/**
 * Serviço de API
 * Emunah Gold 18K - Frontend
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Product, 
  Category, 
  RegisterData 
} from '../types';

/**
 * URL base da API
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Instância do axios configurada
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Métodos de autenticação
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await this.api.post('/auth/login', { email, password });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro no login');
    }
    
    return response.data.data;
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await this.api.post('/auth/register', userData);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro no registro');
    }
    
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = 
      await this.api.get('/auth/profile');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar perfil');
    }
    
    return response.data.data;
  }

  /**
   * Métodos de produtos
   */
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.search) queryParams.append('search', params.search);

    const response: AxiosResponse<PaginatedResponse<Product>> = 
      await this.api.get(`/products?${queryParams.toString()}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erro ao buscar produtos');
    }
    
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = 
      await this.api.get(`/products/${id}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Produto não encontrado');
    }
    
    return response.data.data;
  }

  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const queryParams = limit ? `?limit=${limit}` : '';
    const response: AxiosResponse<ApiResponse<Product[]>> = 
      await this.api.get(`/products/featured${queryParams}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar produtos em destaque');
    }
    
    return response.data.data;
  }

  async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<ApiResponse<Category[]>> = 
      await this.api.get('/products/categories');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Erro ao buscar categorias');
    }
    
    return response.data.data;
  }

  /**
   * Métodos de carrinho (placeholder para implementação futura)
   */


  // Métodos do carrinho
  async getCartItems() {
    const response = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number) {
    const response = await this.api.post('/cart', {
      product_id: productId,
      quantity
    });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number) {
    const response = await this.api.put(`/cart/${productId}`, { quantity });
    return response.data;
  }

  async removeFromCart(productId: string) {
    const response = await this.api.delete(`/cart/${productId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.api.delete('/cart');
    return response.data;
  }

  // Métodos de pedidos
  async createOrder(orderData: {
    payment_method: 'credit_card' | 'pix';
    shipping_address: any;
    notes?: string;
  }) {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async getUserOrders() {
    const response = await this.api.get('/orders');
    return response.data;
  }

  async getOrderById(orderId: string) {
    const response = await this.api.get(`/orders/${orderId}`);
    return response.data;
  }

  async confirmPayment(orderId: string) {
    const response = await this.api.post(`/orders/${orderId}/confirm-payment`);
    return response.data;
  }

  // Métodos de rastreamento
  async getTrackingInfo(trackingCode: string) {
    const response = await this.api.get(`/tracking/${trackingCode}`);
    return response.data;
  }

  async getOrderTracking(orderId: string) {
    const response = await this.api.get(`/tracking/order/${orderId}`);
    return response.data;
  }
}

const apiService = new ApiService();

export default apiService;

