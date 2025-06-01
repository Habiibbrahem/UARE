// src/store/store.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Request } from 'express';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/constants/roles.enum';
import { User } from '../user/user.entity';

interface RequestWithUser extends Request {
    user: User & { _id: Types.ObjectId };
}

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    //
    // ————————————————
    // these must come _before_ the `/:id` route
    // ————————————————
    //

    @Get('member')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.STORE_MEMBER, Roles.STORE_OWNER, Roles.ADMIN)
    findMyStoresAsMember(@Req() req: RequestWithUser) {
        return this.storeService.findStoresByMember(req.user._id.toString());
    }

    @Get('owner')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.STORE_OWNER, Roles.ADMIN)
    findMyStoresAsOwner(@Req() req: RequestWithUser) {
        return this.storeService.findStoresByOwner(req.user._id.toString());
    }

    //
    // ————————————————
    // after those, the old `/:id` routes
    // ————————————————
    //

    @Get()
    findAll() {
        return this.storeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storeService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    create(
        @Body() createStoreDto: CreateStoreDto,
        @Req() req: RequestWithUser,
    ) {
        return this.storeService.create(createStoreDto, req.user._id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
        return this.storeService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    remove(@Param('id') id: string) {
        return this.storeService.remove(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return { imageUrl: `/uploads/stores/${file.filename}` };
    }

    @Post(':id/members')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.STORE_OWNER)
    async addMember(
        @Param('id') storeId: string,
        @Body() addMemberDto: AddMemberDto,
        @Req() req: RequestWithUser,
    ) {
        const store = await this.storeService.findOneWithOwner(storeId);
        if (!store) throw new NotFoundException('Store not found');
        if (!store.ownerId.equals(req.user._id))
            throw new ForbiddenException('Only owner can add members');
        if (!Types.ObjectId.isValid(addMemberDto.userId))
            throw new BadRequestException('Invalid user ID');
        return this.storeService.addMember(storeId, addMemberDto.userId);
    }

    @Delete(':id/members/:userId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.STORE_OWNER)
    async removeMember(
        @Param('id') storeId: string,
        @Param('userId') userId: string,
        @Req() req: RequestWithUser,
    ) {
        const store = await this.storeService.findOneWithOwner(storeId);
        if (!store) throw new NotFoundException('Store not found');
        if (!store.ownerId.equals(req.user._id))
            throw new ForbiddenException('Only owner can remove members');
        if (!Types.ObjectId.isValid(userId))
            throw new BadRequestException('Invalid user ID');
        return this.storeService.removeMember(storeId, userId);
    }
}
