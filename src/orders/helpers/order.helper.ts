// src/orders/helpers/order.helper.ts

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class OrderHelper {
    constructor(
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService
    ) { }

    async generateOrderNumber(): Promise<string> {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

        // Get the last order placed today
        const lastOrder = await this.ordersService.findLastOrderToday();

        // If a last order exists, increment the order number; otherwise, start from 1
        const sequence = lastOrder
            ? parseInt(lastOrder.orderNumber.split('-')[2]) + 1
            : 1;

        // Format the new order number (e.g., ORD-20250429-0001)
        return `ORD-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    }
}
