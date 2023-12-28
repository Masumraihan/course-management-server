import { Query } from 'mongoose';
import { TQueryObject } from '../types/QueryObject';

const price = <T>(modelQuery: Query<T[], T>, query: TQueryObject) => {
  if (query.minPrice && query.maxPrice) {
    return modelQuery.find({
      $and: [
        { price: { $gt: query.minPrice } },
        { price: { $lt: query.maxPrice } },
      ],
    });
  }
  return modelQuery;
};

export default price;
