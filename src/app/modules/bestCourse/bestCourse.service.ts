import httpStatus from 'http-status';
import mongoose from 'mongoose';
import GenericError from '../../errors/GenericError';
import { ReviewModel } from '../review/review.model';

// GET BEST COURSE BASED ON REVIEW AND RATING
const getBestCourse = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const bestCourse = await ReviewModel.aggregate([
      {
        $group: {
          _id: '$courseId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1 } },
      { $limit: 1 },
    ]).session(session);
    if (!bestCourse.length) {
      throw new GenericError(
        'Failed to find best course',
        httpStatus.NOT_FOUND,
      );
    }

    const courseDetails = await ReviewModel.findOne({
      courseId: bestCourse[0]._id,
    })
      .session(session)
      .populate('courseId')
      .lean();

    if (!courseDetails) {
      throw new GenericError(
        'Failed to find best course',
        httpStatus.NOT_FOUND,
      );
    }

    const result = {
      course: courseDetails?.courseId,
      averageRating: bestCourse[0].averageRating,
      reviewCount: bestCourse[0].reviewCount,
    };

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new GenericError('Failed to find best course', httpStatus.NOT_FOUND);
  }
};

export const BestCourseServices = {
  getBestCourse,
};
