import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    Req,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/constants/roles.enum';
import { Request } from 'express';

interface RequestWithUser extends Request {
    user: {
        role: Roles;
    };
}

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN, Roles.STORE_OWNER)
    async create(@Body() user: CreateUserDto, @Req() req: RequestWithUser) {
        if (!req.user || !req.user.role) {
            throw new ForbiddenException('User role is missing');
        }

        const requesterRole = req.user.role;
        const roleToCreate = user.role ?? Roles.CUSTOMER;

        if (requesterRole === Roles.ADMIN) {
            if (![Roles.STORE_OWNER, Roles.CUSTOMER].includes(roleToCreate)) {
                throw new ForbiddenException('Admin can only create Store Owners or Customers');
            }
        } else if (requesterRole === Roles.STORE_OWNER) {
            if (roleToCreate !== Roles.STORE_MEMBER) {
                throw new ForbiddenException('Store Owners can only create Store Members');
            }
        } else {
            throw new ForbiddenException('You do not have permission to create users');
        }

        return this.userService.create(user);
    }

    // Static route before dynamic
    @Get('store-owners-with-stores')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async getStoreOwnersWithStores() {
        return this.userService.findStoreOwnersWithStores();
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN, Roles.STORE_OWNER)   // <-- add STORE_OWNER here
    async findAll() {
        return this.userService.findAll();
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
        const updatedUser = await this.userService.update(id, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException('User not found or update failed');
        }
        return updatedUser;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    async remove(@Param('id') id: string) {
        const deleted = await this.userService.remove(id);
        if (!deleted) {
            throw new NotFoundException('User not found or delete failed');
        }
        return { message: 'User deleted successfully' };
    }
}
