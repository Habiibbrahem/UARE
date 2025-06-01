import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) public storeModel: Model<Store>,
    ) { }

    async findAll(): Promise<Store[]> {
        return this.storeModel.find()
            .populate('ownerId', 'name email')
            .exec();
    }

    async findOne(id: string): Promise<Store> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid store ID');
        }

        const store = await this.storeModel
            .findById(id)
            .populate('products')
            .populate('ownerId', 'name email')
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
            ownerId: null,
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

    async removeMember(storeId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<Store> {
        const storeObjectId = typeof storeId === 'string' ? new Types.ObjectId(storeId) : storeId;
        const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

        const store = await this.findOne(storeObjectId.toString());

        const memberIndex = store.members.findIndex(member => member.equals(userObjectId));
        if (memberIndex === -1) {
            throw new NotFoundException('Member not found in store');
        }

        store.members.splice(memberIndex, 1);
        await store.save();

        return store;
    }

    async findStoresByOwner(ownerId: string | Types.ObjectId): Promise<Store[]> {
        const ownerObjectId =
            typeof ownerId === 'string' ? new Types.ObjectId(ownerId) : ownerId;

        return this.storeModel
            .find({ ownerId: ownerObjectId })
            .populate('members', 'name email')   // <-- populate members now
            .exec();
    }
    async findStoresByMember(userId: string): Promise<Store[]> {
        return this.storeModel
            .find({ members: new Types.ObjectId(userId) })
            .populate('members', 'name email')
            .exec();
    }

    async findOneWithOwner(id: string): Promise<Store | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid store ID');
        }

        const store = await this.storeModel.findById(id)
            .populate('ownerId', 'name email')
            .exec();

        if (!store) {
            return null;
        }

        return store;
    }
}
