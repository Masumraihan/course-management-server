/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import moment from 'moment';
import mongoose from 'mongoose';
import GenericError from '../../errors/GenericError';
import { ChangedPasswordHistoryModel } from '../changePassword/changePassword.model';
import { UserModel } from '../user/user.model';
import {
  TChangePassword,
  TJwtPayload,
  TLoginUser,
  TRegisterUser,
} from './auth.interface';
import { createToken, hashedPassword, verifyJwt } from './auth.utils';

//----------------
const registerUserIntoDb = async (payload: TRegisterUser) => {
  const result = await UserModel.create(payload);

  if (!result) {
    throw new GenericError('Failed to register user', httpStatus.BAD_REQUEST);
  }
  const userData = await UserModel.findOne({ email: result.email });
  return userData;
};

// ----------------------------------
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

// ---------------------------
const changePassword = async (payload: TChangePassword, token: string) => {
  const userData = verifyJwt(token);

  const user = await UserModel.findById(userData?._id).select(
    '+password +passwordHistory',
  );

  if (!user) {
    throw new GenericError('User not found', httpStatus.BAD_REQUEST);
  }

  const lastModifiedPass = moment(user.updatedAt as string).format(
    'YYYY-DD-MM [at] h:mm A',
  );

  const passwordHistory = await ChangedPasswordHistoryModel.findOne(
    { _id: user._id },
    { passwords: { $slice: -2 }, _id: 0 },
  );

  if (passwordHistory) {
    for (const password of passwordHistory.passwords) {
      // CHECK THE CURRENT PASSWORD IS MATCHED THE LAST 2 PASSWORD AND CURRENT PASSWORD
      const isMatched = await UserModel.isPasswordMatched(
        payload.newPassword,
        password,
      );
      if (isMatched) {
        {
          throw new GenericError(
            `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${lastModifiedPass}).`,
            httpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  if (
    !(await UserModel.isPasswordMatched(payload.currentPassword, user.password))
  ) {
    throw new GenericError(
      `Current  Ensure the new password is unique and not among the last 2 used (last used on ${lastModifiedPass}).`,
      httpStatus.BAD_REQUEST,
    );
  }
  if (await UserModel.isPasswordMatched(payload.newPassword, user.password)) {
    throw new GenericError(
      `New password and current password is same. Ensure the new password is unique and not among the last 2 used (last used on ${lastModifiedPass}).`,
      httpStatus.BAD_REQUEST,
    );
  }

  const newPassword = await hashedPassword(payload.newPassword);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const isPasswordChanged = await UserModel.findByIdAndUpdate(
      user._id,
      {
        password: newPassword,
        passwordChangedAt: new Date(),
      },
      { session },
    );

    if (!isPasswordChanged) {
      throw new GenericError(
        `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${lastModifiedPass}).`,
        httpStatus.BAD_REQUEST,
      );
    }
    await ChangedPasswordHistoryModel.findByIdAndUpdate(
      isPasswordChanged._id,
      { $push: { passwords: [user.password] } },
      { upsert: true, session },
    );

    await session.commitTransaction();
    await session.endSession();
    return isPasswordChanged;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new GenericError(
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${lastModifiedPass}).`,
      httpStatus.BAD_REQUEST,
    );
  }
};

export const AuthServices = {
  registerUserIntoDb,
  loginUser,
  changePassword,
};
