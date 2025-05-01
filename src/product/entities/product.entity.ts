import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'products' })  // Force collection name
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ type: Types.ObjectId, ref: 'Store', required: true })  // Store reference
    storeId: Types.ObjectId;

    @Prop({ type: Object, default: {} })
    attributes: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
