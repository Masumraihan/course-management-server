import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';
import { sortableFields } from '../modules/course/course.constant';

const sort = <T>(modelQuery: Query<T[], T>, queryObject: TQueryObject) => {
  if (
    queryObject.sortBy &&
    sortableFields.find(val => queryObject.sortBy === val)
  ) {
    const sortString = `${
      queryObject.sortOrder && queryObject.sortOrder === 'desc' ? '-' : ''
    }${queryObject.sortBy}`;
    return modelQuery.find().sort(sortString);
  }
  return modelQuery;
};

export default sort;
