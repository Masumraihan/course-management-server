import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BestCourseServices } from './bestCourse.service';

// GET BEST COURSE
const bestCourse = catchAsync(async (req, res) => {
  const result = await BestCourseServices.getBestCourse();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

export const BestCourseControllers = {
  bestCourse,
};
