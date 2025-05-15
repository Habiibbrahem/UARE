import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema({ _id: false })
export class OrderItem {
    @Prop({ required: true })
    productId: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    image?: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);