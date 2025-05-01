import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) private storeModel: Model<Store>,
    ) { }

    async findAll(): Promise<Store[]> {
        return this.storeModel.find().exec();
    }

    async findOne(id: string): Promise<Store> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid store ID');
        }

        const store = await this.storeModel
            .findById(id)
            .populate('products') // Populate the products field to get the list of products for the store
            .exec();

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        return store;
    }

    async create(createStoreDto: Partial<Store>, createdBy: Types.ObjectId): Promise<Store> {
        const newStore = new this.storeModel({
            ...createStoreDto,
            createdBy,
            ownerId: null, // Owner will be assigned later by the admin
        });
        return newStore.save();
    }

    async update(id: string, store: Partial<Store>): Promise<Store> {
        await this.storeModel.findByIdAndUpdate(id, store);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.storeModel.findByIdAndDelete(id);
    }

    async addMember(storeId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<Store> {
        const storeObjectId = typeof storeId === 'string' ? new Types.ObjectId(storeId) : storeId;
        const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

        const store = await this.findOne(storeObjectId.toString());

        if (!store.members.some(member => member.equals(userObjectId))) {
            store.members.push(userObjectId);
            await store.save();
        }

        return store;
    }

    async findOneWithOwner(id: string): Promise<Store | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid store ID');
        }

        const store = await this.storeModel.findById(id)
            .populate('ownerId')
            .exec();

        if (!store) {
            return null;
        }

        return store;
    }
}
