import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateSubcategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsMongoId()
    @IsNotEmpty()
    categoryId: string;
}