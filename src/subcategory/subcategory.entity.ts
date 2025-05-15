import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../category/category.entity';
import { Product } from 'src/product/entities/product.entity';

@Schema({ timestamps: true })
export class Subcategory extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category: Category;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    products: Product[];
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);