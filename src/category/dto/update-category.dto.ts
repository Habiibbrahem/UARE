import { IsOptional, IsMongoId, IsString } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsMongoId()
    parentId?: string;

    @IsOptional()
    @IsString()
    image?: string;
}
