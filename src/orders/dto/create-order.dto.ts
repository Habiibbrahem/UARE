// src/orders/dto/create-order.dto.ts

import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsEnum,
    IsArray,
} from 'class-validator';
import { PaymentMethod } from '../constants/order.constants';
import { OrderItem } from '../entities/order-item.entity';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsNotEmpty()
    @IsString()
    storeId: string;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    paymentMethod: string;

    @IsNotEmpty()
    @IsArray()
    items: OrderItem[];

    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

    // ← NEW: validate phoneNumber
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsNumber()
    shippingCost: number;

    @IsNotEmpty()
    @IsNumber()
    subtotal: number;

    @IsNotEmpty()
    @IsNumber()
    taxAmount: number;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @IsOptional()
    @IsString()
    trackingNumber?: string;
}
