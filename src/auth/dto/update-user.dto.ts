import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Roles } from '../constants/roles.enum'; // Import the Roles enum

export class UpdateUserDto {
    @IsOptional() // Make fields optional for updates
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    password?: string;

    @IsOptional()
    @IsEnum(Roles) // Validate that the role is one of the Roles enum values
    role?: Roles; // Include the role field
}