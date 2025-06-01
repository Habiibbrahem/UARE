import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'products', timestamps: true })
export class Product extends Document {
    @Prop({ required: true, index: true })
    name: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ default: 0, min: 0 })
    quantity: number;

    @Prop({ type: Types.ObjectId, ref: 'Store', required: true, index: true })
    storeId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Category', index: true })
    categoryId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Subcategory', index: true })
    subcategoryId: Types.ObjectId;

    @Prop({ type: Object, default: {} })
    attributes: Record<string, any>;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    description?: string;

    @Prop()
    image?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
