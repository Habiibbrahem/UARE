import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description?: string;

    // Use "parent" internally but map from "parentId" in DTOs
    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parent?: Types.ObjectId | null;

    @Prop()
    image?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Virtual to get child categories
CategorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
    justOne: false,
});

// Enable virtuals in JSON and Object output
CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });
