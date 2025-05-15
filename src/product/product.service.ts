import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from '../store/entities/store.entity';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Store.name) private storeModel: Model<Store>,
        private readonly categoryService: CategoryService,
        private readonly subcategoryService: SubcategoryService,
    ) { }

    async create(createProductDto: CreateProductDto, user: any): Promise<Product> {
        const store = await this.storeModel.findById(createProductDto.storeId).exec();
        if (!store) {
            throw new NotFoundException('Store not found');
        }

        // Add null check for store.members
        const isStoreMember = store.members?.some(memberId =>
            memberId.equals(new Types.ObjectId(user._id))) || false;
        const isAdmin = user.role === 'admin';

        if (!isStoreMember && !isAdmin) {
            throw new ForbiddenException('You do not have permission to add products to this store');
        }

        // Validate category if provided
        if (createProductDto.categoryId) {
            const category = await this.categoryService.findOne(createProductDto.categoryId);
            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        // Validate subcategory if provided
        if (createProductDto.subcategoryId) {
            const subcategory = await this.subcategoryService.findOne(createProductDto.subcategoryId);
            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }
        }

        const product = new this.productModel({
            ...createProductDto,
            storeId: new Types.ObjectId(createProductDto.storeId),
            categoryId: createProductDto.categoryId ?
                new Types.ObjectId(createProductDto.categoryId) : undefined,
            subcategoryId: createProductDto.subcategoryId ?
                new Types.ObjectId(createProductDto.subcategoryId) : undefined,
        });

        await product.save();

        // Update store's products array
        await this.storeModel.findByIdAndUpdate(
            createProductDto.storeId,
            { $push: { products: product._id } }
        ).exec();

        return product;
    }

    async findAll(filter: any = {}): Promise<Product[]> {
        return this.productModel.find(filter)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name')
            .exec();
    }

    async findOne(id: string): Promise<Product> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.productModel.findById(id)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name')
            .exec();

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto, user: any): Promise<Product> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check permissions
        const store = await this.storeModel.findById(product.storeId).exec();
        if (!store) {
            throw new NotFoundException('Store not found');
        }

        const isStoreMember = store.members?.some(memberId =>
            memberId.equals(new Types.ObjectId(user._id))) || false;
        const isAdmin = user.role === 'admin';

        if (!isStoreMember && !isAdmin) {
            throw new ForbiddenException('You do not have permission to update this product');
        }

        // Validate category if provided
        if (updateProductDto.categoryId) {
            const category = await this.categoryService.findOne(updateProductDto.categoryId);
            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        // Validate subcategory if provided
        if (updateProductDto.subcategoryId) {
            const subcategory = await this.subcategoryService.findOne(updateProductDto.subcategoryId);
            if (!subcategory) {
                throw new NotFoundException('Subcategory not found');
            }
        }

        // Prepare update data
        const updateData: any = {
            ...updateProductDto,
            storeId: updateProductDto.storeId ?
                new Types.ObjectId(updateProductDto.storeId) : undefined,
            categoryId: updateProductDto.categoryId ?
                new Types.ObjectId(updateProductDto.categoryId) : undefined,
            subcategoryId: updateProductDto.subcategoryId ?
                new Types.ObjectId(updateProductDto.subcategoryId) : undefined,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]);

        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).exec();

        if (!updatedProduct) {
            throw new NotFoundException('Product not found after update');
        }

        return updatedProduct;
    }

    async remove(id: string, user: any): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check permissions
        const store = await this.storeModel.findById(product.storeId).exec();
        if (!store) {
            throw new NotFoundException('Store not found');
        }

        const isStoreMember = store.members?.some(memberId =>
            memberId.equals(new Types.ObjectId(user._id))) || false;
        const isAdmin = user.role === 'admin';

        if (!isStoreMember && !isAdmin) {
            throw new ForbiddenException('You do not have permission to delete this product');
        }

        await this.productModel.deleteOne({ _id: id }).exec();

        // Remove product reference from store
        await this.storeModel.findByIdAndUpdate(
            product.storeId,
            { $pull: { products: product._id } }
        ).exec();
    }

    async findByStore(storeId: string): Promise<Product[]> {
        if (!Types.ObjectId.isValid(storeId)) {
            throw new BadRequestException('Invalid store ID');
        }

        return this.productModel.find({ storeId })
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name')
            .exec();
    }

    async findByCategory(categoryId: string): Promise<Product[]> {
        if (!Types.ObjectId.isValid(categoryId)) {
            throw new BadRequestException('Invalid category ID');
        }

        return this.productModel.find({ categoryId })
            .populate('subcategoryId', 'name')
            .exec();
    }

    async findBySubcategory(subcategoryId: string): Promise<Product[]> {
        if (!Types.ObjectId.isValid(subcategoryId)) {
            throw new BadRequestException('Invalid subcategory ID');
        }

        return this.productModel.find({ subcategoryId }).exec();
    }
}