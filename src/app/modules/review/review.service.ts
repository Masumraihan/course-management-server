import httpStatus from 'http-status';
import GenericError from '../../errors/GenericError';
import { CourseModel } from '../course/course.model';
import { TReview } from './review.interface';
import { ReviewModel } from './review.model';
import { verifyJwt } from '../auth/auth.utils';
import { UserModel } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';

// CREATE REVIEW INTO DATABASE
const createReviewIntoDb = async (payload: TReview, token: string) => {
  // VERIFY TOKEN
  const decoded = verifyJwt(token);
  const { _id, email, role } = decoded as JwtPayload;
  const user = await UserModel.findOne({ _id, email });
  if (!user) {
    throw new GenericError('Unauthorized Access', httpStatus.FORBIDDEN);
  }

  if (user.role !== role) {
    throw new GenericError('Unauthorized Access', httpStatus.FORBIDDEN);
  }

  payload.createdBy = user._id;

  const courseId = payload.courseId;
  const isCourseExists = await CourseModel.exists({ _id: courseId }).lean();
  if (!isCourseExists) {
    throw new GenericError('Course Not Found', httpStatus.NOT_FOUND);
  }
  const result = (await ReviewModel.create(payload)).populate('createdBy');
  return result;
};

export const ReviewServices = {
  createReviewIntoDb,
};
