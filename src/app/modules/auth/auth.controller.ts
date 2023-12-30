import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { Request, Response } from 'express';
import GenericError from '../../errors/GenericError';

const userRegistration = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUserIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successful',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new GenericError(
      'Unauthorized Access',
      httpStatus.FORBIDDEN,
    );
  }

  const result = await AuthServices.changePassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const AuthController = {
  userRegistration,
  loginUser,
  changePassword,
};
