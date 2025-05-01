import { Controller, Put, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Put('stores/:storeId/assign/:userId')
    async assignOwnerToStore(
        @Param('storeId') storeId: string,
        @Param('userId') userId: string
    ) {
        return this.adminService.assignStoreOwner(storeId, userId);
    }
}