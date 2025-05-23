import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subcategory } from './subcategory.entity';
import { CreateSubcategoryDto } from 'src/subcategory/dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from 'src/subcategory/dto/update-subcategory.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class SubcategoryService {
    constructor(
        @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
        private categoryService: CategoryService,
    ) { }

    async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
        const category = await this.categoryService.findOne(createSubcategoryDto.categoryId);
        const createdSubcategory = new this.subcategoryModel({
            ...createSubcategoryDto,
            category: category._id,
        });
        return createdSubcategory.save();
    }

    async findAll(): Promise<Subcategory[]> {
        return this.subcategoryModel.find().populate('category').exec();
    }

    async findByCategoryId(categoryId: string): Promise<Subcategory[]> {
        return this.subcategoryModel.find({ category: categoryId }).populate('category').exec();
    }

    async findOne(id: string): Promise<Subcategory> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid subcategory ID');
        }
        const subcategory = await this.subcategoryModel
            .findById(id)
            .populate('category')
            .exec();

        if (!subcategory) {
            throw new NotFoundException('Subcategory not found');
        }
        return subcategory;
    }

    async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid subcategory ID');
        }

        const existingSubcategory = await this.subcategoryModel.findById(id).exec();
        if (!existingSubcategory) {
            throw new NotFoundException('Subcategory not found');
        }

        const updateData: any = {
            name: updateSubcategoryDto.name,
            description: updateSubcategoryDto.description,
        };

        if (updateSubcategoryDto.categoryId) {
            const category = await this.categoryService.findOne(updateSubcategoryDto.categoryId);
            updateData.category = category._id;
        }

        const updatedSubcategory = await this.subcategoryModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();

        if (!updatedSubcategory) {
            throw new NotFoundException('Subcategory not found after update');
        }

        return updatedSubcategory;
    }

    async remove(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid subcategory ID');
        }
        const result = await this.subcategoryModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Subcategory not found');
        }
    }
}
