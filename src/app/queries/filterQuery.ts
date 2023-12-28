import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';
import { excludedQueryFields } from '../modules/course/course.constant';

const filter = <T>(modelQuery: Query<T[], T>, queryObject: TQueryObject) => {
  excludedQueryFields.forEach(field => delete queryObject[field]);
  const query = modelQuery.find(queryObject);
  return query;
};

export default filter;
