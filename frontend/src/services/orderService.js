// src/services/orderService.js
import axiosInstance from './axiosInstance';

/**
 * Sends a new order payload to the backend.
 * createOrderDto should match your backend’s CreateOrderDto schema.
 */
export function createOrder(createOrderDto) {
    return axiosInstance.post('/orders', createOrderDto);
}
