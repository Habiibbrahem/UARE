import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { StoreService } from 'src/store/store.service';
import { Types } from 'mongoose';

@Injectable()
export class StoreMemberGuard implements CanActivate {
    constructor(private storeService: StoreService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // The user is set by JwtAuthGuard
        const storeId = request.body.storeId || request.params.storeId; // Check both body and params

        console.log('User:', user); // Log user details
        console.log('Store ID:', storeId); // Log the storeId being used

        if (!storeId) {
            throw new ForbiddenException('Store ID is required');
        }

        // Check if store exists
        const store = await this.storeService.findOne(storeId);
        if (!store) {
            throw new ForbiddenException('Store not found');
        }

        // Ensure the user is a member of the store
        const storeMember = store.members.some(member => member.equals(new Types.ObjectId(user._id))); // Use equals to compare ObjectId
        console.log('Is user a member?', storeMember); // Log the result of the check

        if (!storeMember) {
            throw new ForbiddenException('You do not have permission to manage this store');
        }

        return true;
    }
}
