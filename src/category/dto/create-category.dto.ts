import { IsNotEmpty, IsOptional, IsMongoId, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsMongoId()
    parentId?: string;  // optional parent category ID

    @IsOptional()
    @IsString()
    image?: string;
}
