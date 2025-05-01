// src/store/dto/create-store.dto.ts
import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateStoreDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    image: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsPhoneNumber() // Validate phone number format
    phoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}