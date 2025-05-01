// update-product.dto.ts
import { IsOptional, IsString, IsNumber, IsMongoId } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsMongoId()
    storeId?: string; // Will be converted to ObjectId in service

    @IsOptional()
    attributes?: Record<string, any>;
}