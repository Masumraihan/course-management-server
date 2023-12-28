import httpStatus from 'http-status';
import GenericError from '../../errors/GenericError';
import { CourseModel } from '../course/course.model';
import { TReview } from './review.interface';
import { ReviewModel } from './review.model';

// CREATE REVIEW INTO DATABASE
const createReviewIntoDb = async (payload: TReview) => {
  const courseId = payload.courseId;
  const isCourseExists = await CourseModel.exists({ _id: courseId }).lean();
  if (!isCourseExists) {
    throw new GenericError('Course Not Found', httpStatus.NOT_FOUND);
  }
  const result = await ReviewModel.create(payload);
  return result;
};

export const ReviewServices = {
  createReviewIntoDb,
};
