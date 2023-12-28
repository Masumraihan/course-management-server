import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    versionKey: false,
  },
);

const CategoryModel = model<TCategory>('Category', CategorySchema);

export default CategoryModel;
