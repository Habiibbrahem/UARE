import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    orderNumber: string;

    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsNotEmpty()
    @IsString()
    storeId: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    paymentStatus: string;

    @IsNotEmpty()
    orderDate: Date;

    @IsNotEmpty()
    @IsString()
    shippingAddress: string;

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
    trackingNumber: string;

    @IsOptional()
    deliveredAt: Date;

    @IsNotEmpty()
    createdAt: Date;

    @IsNotEmpty()
    updatedAt: Date;
}
