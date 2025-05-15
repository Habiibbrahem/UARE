import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateSubcategoryDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsMongoId()
    @IsOptional()
    categoryId?: string;
}