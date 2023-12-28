import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const durationInWeeks = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.durationInWeeks) {
    return modelQuery.find({ durationInWeeks: query.durationInWeeks });
  }
  return modelQuery;
};

export default durationInWeeks;
