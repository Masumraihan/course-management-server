import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const level = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.level) {
    return modelQuery.find({ 'details.level': query.level });
  }
  return modelQuery;
};

export default level;
