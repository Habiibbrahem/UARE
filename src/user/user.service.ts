import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>, // Mongoose injection
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        console.log(`Searching for user with email: ${email}`);  // Add logging here
        return this.userModel.findOne({ email }).exec();
    }



    async create(user: Partial<User>): Promise<User> {
        const createdUser = new this.userModel(user);
        return createdUser.save(); // Mongoose save
    }
}