// src/store/dto/update-store.dto.ts
import { IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateStoreDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    members?: Types.ObjectId[];
}
