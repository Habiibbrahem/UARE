// src/orders/guards/order-owner.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { StoreService } from '../../store/store.service';
import { OrdersService } from '../orders.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class OrderOwnerGuard implements CanActivate {
    constructor(
        private readonly storeService: StoreService,
        private readonly ordersService: OrdersService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const orderId = request.params.id;
        const userId = new ObjectId(request.user._id);

        const order = await this.ordersService.findOne(orderId);
        if (!order) throw new ForbiddenException('Order not found');

        const store = await this.storeService.findOne(order.storeId.toString());
        if (!store || !store.ownerId) throw new ForbiddenException('Store not found or invalid');

        const isOwner = store.ownerId.equals(userId);
        const isMember = store.members?.some(member => new ObjectId(member).equals(userId));

        return isOwner || isMember;
    }
}