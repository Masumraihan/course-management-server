//import httpStatus from 'http-status';
//import catchAsync from '../../utils/catchAsync';
//import sendResponse from '../../utils/sendResponse';
//import { UserService } from './user.service';

//const userRegistration = catchAsync(async (req, res) => {
//  const result = await UserService.registerUserIntoDb(req.body);

//  sendResponse(res, {
//    statusCode: httpStatus.CREATED,
//    success: true,
//    message: 'User registered successfully',
//    data: result,
//  });
//});

//export const UserController = {
//  userRegistration,
//};
