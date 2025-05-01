import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from '../store/entities/store.entity';
import { StoreService } from '../store/store.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Store.name) private storeModel: Model<Store>,
    ) { }

    async create(createProductDto: CreateProductDto, user: any) {
        const store = await this.storeModel.findById(createProductDto.storeId).exec();
        if (!store) {
            throw new NotFoundException('Store not found');
        }

        // Ensure the store member is authorized to manage products for this store
        const storeMember = store.members.some(memberId => memberId.equals(new Types.ObjectId(user._id)));
        if (!storeMember) {
            throw new ForbiddenException('You do not have permission to manage products for this store');
        }

        const product = new this.productModel({
            ...createProductDto,
            storeId: new Types.ObjectId(createProductDto.storeId),  // Store the association to the store
        });

        await product.save();

        // Update the store's products array with the new product ID
        await this.storeModel.findByIdAndUpdate(createProductDto.storeId, {
            $push: { products: product._id },
        });

        return product;
    }

    async findAll() {
        return this.productModel.find().exec();
    }

    async findOne(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID format');
        }

        if (updateProductDto.storeId) {
            if (!Types.ObjectId.isValid(updateProductDto.storeId)) {
                throw new BadRequestException('Invalid store ID format');
            }
            const storeExists = await this.storeModel.findById(updateProductDto.storeId);
            if (!storeExists) {
                throw new NotFoundException('Store not found');
            }
        }

        return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    }

    async remove(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const result = await this.productModel.deleteOne({ _id: id }).exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException('Product not found');
        }
        return { message: 'Product deleted successfully' };
    }

    async findByStore(storeId: string) {
        if (!Types.ObjectId.isValid(storeId)) {
            throw new BadRequestException('Invalid store ID format');
        }

        const storeExists = await this.storeModel.findById(storeId);
        if (!storeExists) {
            throw new NotFoundException(`Store with ID ${storeId} not found`);
        }

        return this.productModel.find({ storeId }).exec();
    }
}
