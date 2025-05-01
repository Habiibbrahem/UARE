import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from '../store/entities/store.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Store.name) private storeModel: Model<Store>,
    ) { }

    async assignStoreOwner(storeId: string, userId: string) {
        const store = await this.storeModel.findById(storeId).exec();

        if (store?.ownerId) {
            throw new Error('Store already has an owner');
        }

        return this.storeModel.findByIdAndUpdate(
            storeId,
            { ownerId: new Types.ObjectId(userId) },
            { new: true }
        ).exec();
    }
}