import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';
import GenericError from '../../errors/GenericError';

// CREATE CATEGORY INTO DATABASE
const createCategory = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
  }

  const result = await CategoryServices.createCategoryIntoDb(req.body, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  });
});

// GET ALL CATEGORIES FROM DATABASE
const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
};
