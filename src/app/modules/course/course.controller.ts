import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import GenericError from '../../errors/GenericError';

// CREATE COURSE INTO DATABASE
const createCourse = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
  }

  const result = await CourseServices.createCourseIntoDb(req.body, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course created successfully',
    data: result,
  });
});

// GET ALL COURSES FROM DATABASE
const getAllCourses = catchAsync(async (req, res) => {
  const { result, meta } = await CourseServices.getAllCoursesFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'courses retrieved successfully',
    meta,
    data: result,
  });
});

// GET SINGLE COURSE FROM DATABASE
const singleCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getSingleCourseFromDb(
    req.params.courseId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  });
});

// UPDATE COURSE INTO DATABASE
const updateCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.updateCourseIntoDb(
    req.params.courseId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course updated successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  singleCourse,
  updateCourse,
};
