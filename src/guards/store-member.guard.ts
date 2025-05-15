import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException // Add this import
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { ProductService } from '../product/product.service';
import { Types } from 'mongoose';

@Injectable()
export class StoreMemberGuard implements CanActivate {
    constructor(
        private storeService: StoreService,
        private productService: ProductService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Try to get storeId from multiple sources
        let storeId = request.body?.storeId ||
            request.params?.storeId ||
            request.query?.storeId;

        // For product-specific routes
        if (!storeId && request.params?.id) {
            try {
                const product = await this.productService.findOne(request.params.id);
                if (!product?.storeId) {
                    throw new ForbiddenException('Product has no store association');
                }
                storeId = product.storeId.toString();
                request.params.storeId = storeId; // Store for later use
            } catch (err) {
                // Handle specific error cases
                if (err instanceof NotFoundException) {
                    throw new ForbiddenException('Product not found');
                }
                throw new ForbiddenException('Error verifying product store: ' + err.message);
            }
        }

        if (!storeId) {
            throw new ForbiddenException('Store ID is required');
        }

        // Verify store exists
        const store = await this.storeService.findOne(storeId);
        if (!store) {
            throw new NotFoundException('Store not found');
        }

        // Verify user is member
        const isMember = store.members.some(member =>
            member.equals(new Types.ObjectId(user._id))
        );

        if (!isMember) {
            throw new ForbiddenException('You do not have permission for this store');
        }

        return true;
    }
}