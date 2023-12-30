import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';
import GenericError from '../../errors/GenericError';

// CREATE REVIEW INTO DATABASE
const createReview = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new GenericError('Unauthorized Access', httpStatus.BAD_REQUEST);
  }

  const result = await ReviewServices.createReviewIntoDb(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
};
