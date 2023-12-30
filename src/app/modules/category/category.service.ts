import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../auth/auth.utils';
import { UserModel } from '../user/user.model';
import { TCategory } from './category.interface';
import CategoryModel from './category.model';
import GenericError from '../../errors/GenericError';
import httpStatus from 'http-status';

// CREATE A CATEGORY INTO DATABASE
const createCategoryIntoDb = async (payload: TCategory, token: string) => {
  // VERIFY TOKEN
  const decoded = verifyJwt(token);
  const { _id, email, role } = decoded as JwtPayload;
  const user = await UserModel.findOne({ _id, email });
  if (!user) {
    throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
  }

  if (user.role !== role) {
    throw new GenericError('Unauthorized Access', httpStatus.UNAUTHORIZED);
  }

  payload.createdBy = user._id;

  const result = (await CategoryModel.create(payload)).populate('createdBy');
  return result;
};

// GET ALL CATEGORIES FROM DATABASE
const getAllCategoriesFromDb = async () => {
  const result = await CategoryModel.find().populate('createdBy');
  return result;
};

export const CategoryServices = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
};
