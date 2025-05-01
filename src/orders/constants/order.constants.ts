// src/orders/constants/order.constants.ts

export enum OrderStatus {
    PENDING = 'Pending',
    PAID = 'Paid',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
    PENDING = 'Pending',
    PAID = 'Paid',
    FAILED = 'Failed',
}
