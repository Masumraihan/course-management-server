import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import GenericError from '../../errors/GenericError';
import { UserModel } from '../user/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';

const registerUserIntoDb = async (payload: TRegisterUser) => {
  const result = await UserModel.create(payload);

  if (!result) {
    throw new GenericError('Failed to register user', httpStatus.BAD_REQUEST);
  }
  const userData = await UserModel.findOne({ email: result.email });
  return userData;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await UserModel.findOne({ username: payload?.username }).select(
    '+password',
  );

  if (!user) {
    throw new GenericError('User not found', httpStatus.NOT_FOUND);
  }

  if (!(await UserModel.isPasswordMatched(payload.password, user?.password))) {
    throw new GenericError('Password not matched', httpStatus.NOT_FOUND);
  }
};

export const AuthServices = {
  registerUserIntoDb,
  loginUser,
};
