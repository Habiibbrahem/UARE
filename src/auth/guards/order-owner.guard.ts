// src/orders/guards/order-owner.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StoreService } from '../../store/store.service';

@Injectable()
export class OrderOwnerGuard implements CanActivate {
    constructor(private readonly storeService: StoreService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const storeId = request.body.storeId;  // Assuming storeId is part of the request body

        // Check if the logged-in user is the store owner
        if (storeId) {
            return this.storeService.findOne(storeId).then(store => {
                if (store && store.ownerId !== user._id) {
                    throw new ForbiddenException('You are not the store owner');
                }
                return true;
            });
        }

        throw new ForbiddenException('Store not found');
    }
}
