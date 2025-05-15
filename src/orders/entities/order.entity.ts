import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentMethod } from '../constants/order.constants';
import { OrderItem } from 'src/orders/entities/order-item.entity';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true, unique: true })
    orderNumber: string;

    @Prop({ required: true })
    customerId: string;

    @Prop({ required: true })
    storeId: string;

    @Prop({ required: true, default: 'pending' })
    status: string;

    @Prop({ required: true, default: 'pending' })
    paymentStatus: string;

    @Prop({ required: true, enum: Object.values(PaymentMethod) })
    paymentMethod: string;

    @Prop({ type: [OrderItem], required: true })
    items: OrderItem[];

    @Prop({ required: true })
    orderDate: Date;

    @Prop({ required: true })
    shippingAddress: string;

    @Prop({ required: true })
    shippingCost: number;

    @Prop({ required: true })
    subtotal: number;

    @Prop({ required: true })
    taxAmount: number;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: false })
    trackingNumber?: string;

    @Prop()
    deliveredAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);