import axiosInstance from './axiosInstance';

/**
 * Matches your CreateOrderDto exactly.
 */
export function createOrder(createOrderDto) {
    return axiosInstance.post('/orders', createOrderDto);
}
