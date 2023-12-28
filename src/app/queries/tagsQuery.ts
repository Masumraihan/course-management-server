import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const tags = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.tags) {
    return modelQuery.find({ 'tags.name': query.tags });
  }
  return modelQuery;
};

export default tags;
