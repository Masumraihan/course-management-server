/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import GenericError from '../../errors/GenericError';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const registerUserIntoDb = async (payload: TUser) => {
  const result = await UserModel.create(payload);

  if (!result) {
    throw new GenericError('Failed to register user', httpStatus.BAD_REQUEST);
  }
  const userData = await UserModel.findOne({ email: result.email });
  return userData;
};

export const UserService = {
  registerUserIntoDb,
};
