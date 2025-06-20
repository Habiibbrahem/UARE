// src/user/dto/update-me.dto.ts
import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    ValidateIf,
} from 'class-validator';

export class UpdateMeDto {
    @IsNotEmpty()
    currentPassword: string;

    // newPassword is optional, but if provided it must be at least 8 chars
    @ValidateIf(o => o.newPassword !== undefined && o.newPassword !== '')
    @MinLength(8, { message: 'newPassword must be at least 8 characters' })
    newPassword?: string;

    // confirmPassword only needs to be supplied if newPassword is
    @ValidateIf(o => o.newPassword !== undefined && o.newPassword !== '')
    @IsNotEmpty({ message: 'Please confirm your new password' })
    confirmPassword?: string;

    // email is optional, but if supplied it must be valid
    @ValidateIf(o => o.email !== undefined && o.email !== '')
    @IsEmail({}, { message: 'Must be a valid email address' })
    email?: string;
}
