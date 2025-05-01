// src/auth/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Roles } from '../constants/roles.enum';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    role?: Roles = Roles.CUSTOMER; // Default to customer
}