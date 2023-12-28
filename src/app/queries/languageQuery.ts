import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const language = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.language) {
    return modelQuery.find({ language: query.language });
  }
  return modelQuery;
};

export default language;
