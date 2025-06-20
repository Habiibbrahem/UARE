// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Roles } from '../auth/constants/roles.enum';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    /** Find user by ID */
    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    /** Verify plaintext vs stored hash */
    async verifyPassword(userId: string, plain: string): Promise<boolean> {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        return bcrypt.compare(plain, user.password);
    }

    /** Update user (hash new password if provided) */
    async update(
        id: string,
        updateDto: Partial<CreateUserDto>
    ): Promise<User | null> {
        if (updateDto.password) {
            updateDto.password = await bcrypt.hash(updateDto.password, 10);
        }
        return this.userModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
    }

    /** Delete user */
    async remove(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return result != null;
    }

    // — the rest of your existing methods remain unchanged —

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(dto: Partial<CreateUserDto & { role?: Roles }>): Promise<User> {
        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }
        return new this.userModel(dto).save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByRole(role: string): Promise<User[]> {
        return this.userModel.find({ role }).exec();
    }

    async findStoreOwnersWithStores(): Promise<User[]> {
        return this.userModel
            .find({ role: Roles.STORE_OWNER })
            .populate('stores', 'name address')
            .exec();
    }
}
