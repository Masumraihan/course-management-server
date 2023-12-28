import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import GenericError from '../../errors/GenericError';
import { UserModel } from '../user/user.model';
import { TJwtPayload, TLoginUser, TRegisterUser } from './auth.interface';
import { createToken } from './auth.utils';

const registerUserIntoDb = async (payload: TRegisterUser) => {
  const result = await UserModel.create(payload);

  if (!result) {
    throw new GenericError('Failed to register user', httpStatus.BAD_REQUEST);
  }
  const userData = await UserModel.findOne({ email: result.email });
  return userData;
};

const loginUser = async (payload: TLoginUser) => {

  // CHECK THE USER EXISTS OR NOT
  const isUserExists = await UserModel.findOne({
    username: payload?.username,
  }).select('+password');

  if (!isUserExists) {
    throw new GenericError('User not found', httpStatus.NOT_FOUND);
  }

  // CHECK PASSWORD MATCHED OR NOT
  if (
    !(await UserModel.isPasswordMatched(
      payload.password,
      isUserExists?.password,
    ))
  ) {
    throw new GenericError('Password not matched', httpStatus.NOT_FOUND);
  }

  const jwtPayload: TJwtPayload = {
    _id: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const user = await UserModel.findById(isUserExists._id).select(
    '_id username email role ',
  );

  // CREATE JWT ACCESS TOKEN
  const token = createToken(jwtPayload);
  return { user, token };
};

const changePassword = async (payload: {
  previousPass: string;
  newPass: string;
}) => {};

export const AuthServices = {
  registerUserIntoDb,
  loginUser,
};
