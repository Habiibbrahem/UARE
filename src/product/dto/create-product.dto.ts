import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    IsMongoId,
    Min,
    IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    quantity?: number;

    @IsMongoId()
    @IsNotEmpty()
    storeId: string;

    @IsMongoId()
    @IsOptional()
    categoryId?: string;

    @IsMongoId()
    @IsOptional()
    subcategoryId?: string;

    @IsOptional()
    attributes?: Record<string, any>;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;
}