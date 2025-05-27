import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './category.entity';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const categoryData: any = {
            name: createCategoryDto.name,
            description: createCategoryDto.description,
            image: createCategoryDto.image,
            parent: createCategoryDto.parentId || null,  // Map parentId to parent
        };

        const created = new this.categoryModel(categoryData);
        return created.save();
    }

    async findAll(): Promise<Category[]> {
        // Return only root categories with children populated recursively
        return this.categoryModel.find({ parent: null }).populate('children').exec();
    }

    async findChildren(parentId: string): Promise<Category[]> {
        if (!Types.ObjectId.isValid(parentId)) {
            throw new NotFoundException('Invalid parent category ID');
        }
        return this.categoryModel.find({ parent: parentId }).populate('children').exec();
    }

    async findOne(id: string): Promise<Category> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid category ID');
        }
        const category = await this.categoryModel.findById(id).populate('children').exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid category ID');
        }

        const updateData: any = {
            ...updateCategoryDto,
        };

        if ('parentId' in updateCategoryDto) {
            updateData.parent = updateCategoryDto.parentId || null;
            delete updateData.parentId;
        }

        const updated = await this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException('Category not found');
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid category ID');
        }
        const result = await this.categoryModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Category not found');
        }
    }
}
