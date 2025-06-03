import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../auth/constants/roles.enum';

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: String, enum: Roles, default: Roles.CUSTOMER })
    role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual populate to get stores owned by this user
UserSchema.virtual('stores', {
    ref: 'Store',
    localField: '_id',
    foreignField: 'ownerId',
    justOne: false,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });