import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable() // Make sure this decorator is present
export class OrderHelper {
    constructor(@Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
    ) { }

    async generateOrderNumber(): Promise<string> {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

        const lastOrder = await this.ordersService.findLastOrderToday();
        const sequence = lastOrder
            ? parseInt(lastOrder.orderNumber.split('-')[2]) + 1
            : 1;

        return `ORD-${dateStr}-${sequence.toString().padStart(4, '0')}`;
    }
}