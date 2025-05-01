import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

import { IsMongoId } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsOptional()
    quantity?: number;

    @IsMongoId()
    @IsNotEmpty()
    storeId: string;

    @IsOptional()
    attributes?: Record<string, any>;
}
