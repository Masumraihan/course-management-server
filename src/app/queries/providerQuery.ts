import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const provider = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.provider) {
    return modelQuery.find({ provider: query.provider });
  }
  return modelQuery;
};

export default provider;
