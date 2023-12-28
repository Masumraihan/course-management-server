import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const date = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.startDate && query.endDate) {
    return modelQuery.find({
      startDate: { $gte: query.startDate },
      endDate: { $lte: query.endDate },
    });
  }
  return modelQuery;
};

export default date;
