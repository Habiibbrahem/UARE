// src/store/dto/add-member.dto.ts
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class AddMemberDto {
    @IsMongoId()
    userId: Types.ObjectId;  // User ID to be added as a member
}
