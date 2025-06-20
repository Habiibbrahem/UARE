// src/user/user.controller.ts
import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    UseGuards,
    Req,
    Param,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/constants/roles.enum';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';

interface RequestWithUser extends Request {
    user: { userId: string; role: Roles; email: string };
}

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // — Admin & Store‐owner: create, list, etc. —

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN, Roles.STORE_OWNER)
    async create(
        @Body() dto: CreateUserDto,
        @Req() req: RequestWithUser
    ) {
        return this.userService.create(dto);
    }

    @Get('store-owners-with-stores')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async getStoreOwnersWithStores() {
        return this.userService.findStoreOwnersWithStores();
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN, Roles.STORE_OWNER)
    async findAll() {
        return this.userService.findAll();
    }

    // — “My Account” —

    // GET /users/me
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: RequestWithUser) {
        const user = await this.userService.findById(req.user.userId);
        if (!user) throw new NotFoundException('User not found');
        // hide password
        return { email: user.email, name: user.name, role: user.role };
    }

    // PUT /users/me
    @Put('me')
    @UseGuards(JwtAuthGuard)
    async updateMe(
        @Req() req: RequestWithUser,
        @Body() dto: UpdateMeDto
    ) {
        // 1) verify current password
        const ok = await this.userService.verifyPassword(
            req.user.userId,
            dto.currentPassword
        );
        if (!ok) throw new ForbiddenException('Current password is incorrect');

        // 2) build payload
        const updateData: any = {};
        if (dto.email && dto.email !== req.user.email) updateData.email = dto.email;
        if (dto.newPassword) updateData.password = dto.newPassword;

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('Nothing to update');
        }

        const updated = await this.userService.update(req.user.userId, updateData);
        if (!updated) throw new BadRequestException('Update failed');
        return { message: 'Account updated successfully' };
    }

    // DELETE /users/me
    @Delete('me')
    @UseGuards(JwtAuthGuard)
    async deleteMe(
        @Req() req: RequestWithUser,
        @Body('currentPassword') currentPassword: string
    ) {
        // verify
        const ok = await this.userService.verifyPassword(
            req.user.userId,
            currentPassword
        );
        if (!ok) throw new ForbiddenException('Current password is incorrect');

        const deleted = await this.userService.remove(req.user.userId);
        if (!deleted) throw new BadRequestException('Deletion failed');
        return { message: 'Account deleted successfully' };
    }

    // — Admin only get/update/delete other users —

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async findOne(@Param('id') id: string) {
        const u = await this.userService.findById(id);
        if (!u) throw new NotFoundException('User not found');
        return u;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async update(
        @Param('id') id: string,
        @Body() dto: Partial<CreateUserDto>
    ) {
        const updated = await this.userService.update(id, dto);
        if (!updated) throw new NotFoundException('Update failed');
        return updated;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async remove(@Param('id') id: string) {
        const deleted = await this.userService.remove(id);
        if (!deleted) throw new NotFoundException('Deletion failed');
        return { message: 'User deleted successfully' };
    }
}
