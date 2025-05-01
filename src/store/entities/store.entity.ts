import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Store extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    image: string;

    @Prop({ type: String, required: true })
    address: string;

    @Prop({ type: String, required: true })
    phoneNumber: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: false // Temporary until owner is assigned
    })
    ownerId: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    members: Types.ObjectId[];

    @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] }) // Add relationship to Products
    products: Types.ObjectId[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
