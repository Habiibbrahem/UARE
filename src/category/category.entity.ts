import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';

@Schema({ timestamps: true })
export class Category extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);