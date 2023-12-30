import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

// create review schema based TReview interface
const ReviewSchema = new Schema<TReview>(
  {
    courseId: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
  },
  { versionKey: false },
);

export const ReviewModel = model<TReview>('Review', ReviewSchema);
