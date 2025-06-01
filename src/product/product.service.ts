import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from '../store/entities/store.entity';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Store.name) private storeModel: Model<Store>,
        private readonly categoryService: CategoryService,
    ) { }

    async create(createProductDto: CreateProductDto, user: any): Promise<Product> {
        const store = await this.storeModel.findById(createProductDto.storeId).exec();
        if (!store) throw new NotFoundException('Store not found');

        const isStoreMember = store.members?.some(memberId =>
            memberId.equals(new Types.ObjectId(user._id)),
        ) || false;
        const isAdmin = user.role === 'admin';

        if (!isStoreMember && !isAdmin) {
            throw new ForbiddenException('You do not have permission to add products to this store');
        }

        if (createProductDto.categoryId) {
            const category = await this.categoryService.findOne(createProductDto.categoryId);
            if (!category) throw new NotFoundException('Category not found');
        }

        const product = new this.productModel({
            ...createProductDto,
            storeId: new Types.ObjectId(createProductDto.storeId),
            categoryId: createProductDto.categoryId ? new Types.ObjectId(createProductDto.categoryId) : undefined,
        });

        await product.save();

        await this.storeModel.findByIdAndUpdate(
            createProductDto.storeId,
            { $push: { products: product._id } },
        ).exec();

        return product;
    }

    async findAll(filter: any = {}): Promise<Product[]> {
        return this.productModel
            .find(filter)
            .populate('categoryId', 'name')
            .exec();
    }

    async findOne(id: string): Promise<Product> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.productModel
            .findById(id)
            .populate('categoryId', 'name')
            .exec();

        if (!product) throw new NotFoundException('Product not found');

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto, user: any): Promise<Product> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.productModel.findById(id).exec();
        if (!product) throw new NotFoundException('Product not found');

        const store = await this.storeModel.findById(product.storeId).exec();
        if (!store) throw new NotFoundException('Store not found');

        const isStoreMember = store.members?.some(memberId =>
            memberId.equals(new Types.ObjectId(user._id)),
        ) || false;
        const isAdmin = user.role === 'admin';

        if (!isStoreMember && !isAdmin) {
            throw new ForbiddenException('You do not have permission to update this product');
        }

        if (updateProductDto.categoryId) {
            const category = await this.categoryService.findOne(updateProductDto.categoryId);
            if (!category) throw new NotFoundException('Category not found');
        }

        const updateData: any = {
            ...updateProductDto,
            storeId: updateProductDto.storeId ? new Types.ObjectId(updateProductDto.storeId) : undefined,
            categoryId: updateProductDto.categoryId ? new Types.ObjectId(updateProductDto.categoryId) : undefined,
        };

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();

        if (!updatedProduct) throw new NotFoundException('Product not found after update');

        return updatedProduct;
    }

    async remove(id: string, user: any): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.productModel.findById(id).exec();
        if (!product) throw new NotFoundException('Product not found');

        const store = await this.storeModel.findById(product.storeId).exec();
        if (!store) throw new NotFoundException('Store not found');

        const isStoreMember = store.members?.some(memberId =>
            memberId.equals(new Types.ObjectId(user._id)),
        ) || false;
        const isAdmin = user.role === 'admin';

        if (!isStoreMember && !isAdmin) {
            throw new ForbiddenException('You do not have permission to delete this product');
        }

        await this.productModel.deleteOne({ _id: id }).exec();

        await this.storeModel.findByIdAndUpdate(product.storeId, { $pull: { products: product._id } }).exec();
    }

    async findByStore(storeId: string): Promise<Product[]> {
        if (!Types.ObjectId.isValid(storeId)) {
            throw new BadRequestException('Invalid store ID');
        }

        // Correction ici : conversion explicite en ObjectId
        const storeObjectId = new Types.ObjectId(storeId);

        return this.productModel.find({ storeId: storeObjectId })
            .populate('categoryId', 'name')
            .exec();
    }

    async findByCategory(categoryId: string): Promise<Product[]> {
        if (!Types.ObjectId.isValid(categoryId)) {
            throw new BadRequestException('Invalid category ID');
        }

        return this.productModel.find({ categoryId })
            .exec();
    }
}
