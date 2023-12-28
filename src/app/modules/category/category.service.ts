import { TCategory } from './category.interface';
import CategoryModel from './category.model';

// CREATE A CATEGORY INTO DATABASE
const createCategoryIntoDb = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};

// GET ALL CATEGORIES FROM DATABASE
const getAllCategoriesFromDb = async () => {
  const result = await CategoryModel.find().select({ __v: 0 });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
};
