import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const paginate = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  const page: number = Number(query.page) || 1;
  const limit: number = Number(query.limit) || 10;
  const skip: number = (page - 1) * limit;

  const total = modelQuery.model.countDocuments(modelQuery.getFilter());
  const data = modelQuery.skip(skip).limit(limit);

  return {
    query: data,
    page,
    limit,
    total,
  };
};

export default paginate;
