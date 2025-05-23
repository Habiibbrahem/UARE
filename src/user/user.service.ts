import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Roles } from '../auth/constants/roles.enum';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(user: Partial<User>): Promise<User> {
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User | null> {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return result != null;
    }

    async findByRole(role: string): Promise<User[]> {
        return this.userModel.find({ role }).exec();
    }

    async findStoreOwnersWithStores() {
        return this.userModel
            .find({ role: Roles.STORE_OWNER })
            .populate('stores', 'name address')  // Populate stores with name and address
            .exec();
    }
}
