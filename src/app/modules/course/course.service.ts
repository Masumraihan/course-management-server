/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import GenericError from '../../errors/GenericError';
import date from '../../queries/dateQuery';
import durationInWeeks from '../../queries/durationInWeeksQuery';
import filter from '../../queries/filterQuery';
import language from '../../queries/languageQuery';
import level from '../../queries/levelQuery';
import paginate from '../../queries/paginateQuery';
import price from '../../queries/pricingQuery';
import provider from '../../queries/providerQuery';
import sort from '../../queries/sortQuery';
import tags from '../../queries/tagsQuery';
import { TQueryObject } from '../../types/QueryObject';
import CategoryModel from '../category/category.model';
import { TCourse } from '../course/course.interface';
import { CourseModel } from '../course/course.model';
import { ReviewModel } from '../review/review.model';

// CREATE A COURSE INTO DATABASE
const createCourseIntoDb = async (payload: TCourse) => {
  const categoryId = payload.categoryId;
  const isCategoryExist = await CategoryModel.exists({
    _id: categoryId,
  }).lean();
  if (!isCategoryExist) {
    throw new GenericError('Category Not Found', 404);
  }
  const result = await CourseModel.create(payload);
  return result;
};

// GET ALL COURSES FROM DATABASE
const getAllCoursesFromDb = async (query: TQueryObject) => {
  const queryObject = { ...query };

  // query functions
  const filterQuery = filter(CourseModel.find(), queryObject);
  const sortQuery = sort(filterQuery.find(), query);
  const pricingQuery = price(sortQuery.find(), query);
  const tagsQuery = tags(pricingQuery.find(), query);
  const dateQuery = date(tagsQuery.find(), query);
  const languageQuery = language(dateQuery.find(), query);
  const durationInWeeksQuery = durationInWeeks(languageQuery.find(), query);
  const providerQuery = provider(durationInWeeksQuery.find(), query);
  const levelQuery = level(providerQuery.find(), query);
  const { page, limit, query: pgQuery } = paginate(levelQuery.find(), query);
  const total = await CourseModel.estimatedDocumentCount();

  const result = await pgQuery;
  const meta = {
    page,
    limit,
    total,
  };

  return { meta, result };
};

// GET SINGLE COURSE FROM DATABASE
const getSingleCourseFromDb = async (courseId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const reviews = await ReviewModel.find({ courseId }).session(session);
    if (reviews === null) {
      throw new GenericError(
        'Field to retrieve course',
        httpStatus.BAD_REQUEST,
      );
    }
    const course = await CourseModel.findById(courseId).session(session);
    if (!course) {
      throw new GenericError(
        'Field to retrieve course',
        httpStatus.BAD_REQUEST,
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return { course, reviews };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new GenericError('Field to retrieve course', httpStatus.BAD_REQUEST);
  }
};

// UPDATE COURSE INTO DATABASE
const updateCourseIntoDb = async (id: string, payload: Partial<TCourse>) => {
  const { tags, details, ...remainingData } = payload;


  const updatableData: Record<string, unknown> = { ...remainingData };

  const session = await mongoose.startSession();

  

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      updatableData[`details.${key}`] = value;
    }
  }
  try {
    session.startTransaction();

    // update primitive data
    const primitiveValueUpdate = await CourseModel.findByIdAndUpdate(
      id,
      updatableData,
      {
        runValidators: true,
        session,
      },
    );

    if (!primitiveValueUpdate) {
      throw new GenericError('Failed to update course', httpStatus.BAD_REQUEST);
    }

    // add new tags
    if (tags?.length) {
      const addableTags = tags.filter(tag => tag.isDeleted === false);

      const addedTags = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: addableTags } },
        },
        { runValidators: true, session },
      );

      if (addableTags.length && !addedTags) {
        throw new GenericError(
          'Failed to update course',
          httpStatus.BAD_REQUEST,
        );
      }

      // delete tag
      const deletableTags = tags
        .filter(tag => tag.isDeleted === true)
        .map(tag => tag.name);

      const deletedTags = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: { tags: { name: { $in: deletableTags } } },
        },
        { new: true, runValidators: true, session },
      );

      if (deletableTags.length && !deletedTags) {
        throw new GenericError(
          'Failed to update course',
          httpStatus.BAD_REQUEST,
        );
      }
    }
    const result = await CourseModel.findById(id).session(session);
    if (!result) {
      throw new GenericError('Failed to update course', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new GenericError(
      error.message || 'Failed to update course',
      httpStatus.BAD_REQUEST,
    );
  }
};

export const CourseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCourseFromDb,
  updateCourseIntoDb,
};
