import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const CategoryModel = model<TCategory>('Category', CategorySchema);

export default CategoryModel;
