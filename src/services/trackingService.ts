import { apiClient } from './baseService/axiosConfig';

export const getTrackingInfo = async (trackingCode: string) => {
  const response = await apiClient.get(`/tracking/${trackingCode}`);
  return response.data;
};

export const getOrderTracking = async (orderId: string) => {
  const response = await apiClient.get(`/tracking/order/${orderId}`);
  return response.data;
};
