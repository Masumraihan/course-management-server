import httpStatus from 'http-status';
import mongoose, { Schema } from 'mongoose';
import GenericError from '../../errors/GenericError';
import { TCourse, TDetails, TTags } from './course.interface';
import generateDurationWeeks from '../../utils/generateDurationWeeks';
import { calculateDurationWeeks } from './course.utils';

// Create a schema based on TTags
const TagsSchema = new Schema<TTags>(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    _id: false,
  },
);

// Create Details schema based on TDetails interface
const DetailsSchema = new Schema<TDetails>(
  {
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

// Create Course schema based on TCourse interface
const CourseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    instructor: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    price: { type: Number, required: true },
    tags: [TagsSchema],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    language: { type: String, required: true },
    provider: { type: String, required: true },
    durationInWeeks: { type: Number },
    details: DetailsSchema,
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    toJSON: {
      virtuals: true,
    },
    versionKey: false,
    id: false,
    timestamps: true,
  },
);

CourseSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const durationInWeeks = calculateDurationWeeks(
      this.startDate,
      this.endDate,
    );
    this.durationInWeeks = durationInWeeks;
    next();
  }
});
CourseSchema.pre('findOneAndUpdate', function (next) {
  const data: Record<string, unknown> | null = { ...this.getUpdate() };

  if (data?.startDate && data?.endDate) {
    if (data.endDate < data.startDate) {
      throw new GenericError(
        `EndDate:${data.endDate} should be greater then StartDate:${data.startDate}`,
        httpStatus.BAD_REQUEST,
      );
    }
    const startDate = new Date(data?.startDate as Date);
    const endDate = new Date(data?.endDate as Date);
    // get millisecond
    const milliseconds = endDate.getTime() - startDate.getTime();
    // calculate millisecond to weeks
    const durationInWeeks = generateDurationWeeks(milliseconds);
    this.updateOne({ durationInWeeks });
  }
  next();
});

export const CourseModel = mongoose.model<TCourse>('Course', CourseSchema);
