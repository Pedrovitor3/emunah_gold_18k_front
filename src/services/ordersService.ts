import { apiClient } from "./baseService/axiosConfig";

  export const createOrder= async(orderData: {
    payment_method: 'credit_card' | 'pix';
    shipping_address: any;
    notes?: string;
  }) =>{
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  }

  export const getUserOrders = async() =>{
    const response = await apiClient.get('/orders');
    return response.data;
  }

  export const getOrderById= async(orderId: string) =>{
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  }

  export const confirmPayment= async(orderId: string) =>{
    const response = await apiClient.post(`/orders/${orderId}/confirm-payment`);
    return response.data;
  }
