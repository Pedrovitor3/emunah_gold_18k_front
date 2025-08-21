import { apiClient } from "./baseService/axiosConfig";

  // Métodos do carrinho
  export const getCartItems = async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  }

  export const addToCart = async(productId: string, quantity: number) =>{
    const response = await apiClient.post('/cart', {
      product_id: productId,
      quantity
    });
    return response.data;
  }

  export const updateCartItem = async(productId: string, quantity: number) =>{
    const response = await apiClient.put(`/cart/${productId}`, { quantity });
    return response.data;
  }

  export const removeFromCart = async(productId: string) =>{
    const response = await apiClient.delete(`/cart/${productId}`);
    return response.data;
  }

  export const clearCart = async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  }