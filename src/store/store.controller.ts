import {
    BadRequestException,
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Put,
    Param,
    Delete,
    Get,
    UseInterceptors,
    UploadedFile,

    NotFoundException // Add this import
} from '@nestjs/common';
import { StoreService } from './store.service'; // Add this import

import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/constants/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { Types } from 'mongoose';
import { ForbiddenException } from '@nestjs/common';

interface RequestWithUser extends Request {
    user: User & { _id: Types.ObjectId };
}

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async create(@Body() createStoreDto: CreateStoreDto, @Req() req: RequestWithUser) {
        return this.storeService.create(createStoreDto, req.user._id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
        return this.storeService.update(id, updateStoreDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    remove(@Param('id') id: string) {
        return this.storeService.remove(id);
    }

    @Get()
    findAll() {
        return this.storeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storeService.findOne(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return {
            imageUrl: `/uploads/stores/${file.filename}`
        };
    }

    // In store.controller.ts
    @Post(':id/members')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.STORE_OWNER)
    async addMember(
        @Param('id') storeId: string,
        @Body() addMemberDto: AddMemberDto,
        @Req() req: RequestWithUser
    ) {
        // First get the store with owner populated
        const store = await this.storeService.findOneWithOwner(storeId);

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        // Convert to ObjectId for safe comparison
        const currentUserId = new Types.ObjectId(req.user._id);

        if (!store.ownerId || !store.ownerId.equals(currentUserId)) {
            throw new ForbiddenException('Only store owner can add members');
        }

        if (!Types.ObjectId.isValid(addMemberDto.userId)) {
            throw new BadRequestException('Invalid user ID format');
        }

        return this.storeService.addMember(storeId, addMemberDto.userId);
    }

    @Put(':storeId/assign/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async assignOwnerToStore(
        @Param('storeId') storeId: string,
        @Param('userId') userId: string
    ) {
        const store = await this.storeService.findOne(storeId);
        if (store.ownerId) {
            throw new Error('Store already has an owner');
        }
        store.ownerId = new Types.ObjectId(userId); // Assign store owner here
        await store.save();
        return store;
    }
}
