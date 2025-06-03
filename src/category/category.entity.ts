// src/category/category.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
    // No longer globally unique—two different parents can both have “Vêtements”
    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    // Use “parent” internally but map from “parentId” in DTOs
    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parent?: Types.ObjectId | null;

    @Prop()
    image?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Drop the single‐field unique index on “name”
// (Make sure to manually remove “name_1” from the database after redeploying,
//  for example via the Mongo shell: db.categories.dropIndex('name_1'))
//
// Then create a compound unique index on (name + parent):
CategorySchema.index({ name: 1, parent: 1 }, { unique: true });

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
