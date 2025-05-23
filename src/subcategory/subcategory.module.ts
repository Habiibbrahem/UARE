import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategory, SubcategorySchema } from './subcategory.entity';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema }
    ]),
    CategoryModule
  ],
  providers: [SubcategoryService],
  controllers: [SubcategoryController],
  exports: [SubcategoryService]
})
export class SubcategoryModule { }