/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../config';
import duplicateError from '../errors/duplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { TErrorResponse } from '../types/ErrorResponse';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let errorObject: TErrorResponse = {
    statusCode: error.statusCode || 400,
    message: 'Error',
    errorDetails: {},
    errorMessage: error.message || 'something went wrong',
  };

  if (error instanceof ZodError) {
    errorObject = handleZodError(error);
  } else if (error instanceof mongoose.Error.ValidationError) {
    errorObject = handleValidationError(error);
  } else if (error.code && error.code === 11000) {
    errorObject = duplicateError(error);
  } else if (error instanceof mongoose.Error.CastError) {
    errorObject.message = 'Invalid ID';
    errorObject.errorMessage = `${error.value} is not a valid ID!`;
    errorObject.errorDetails = { ...error };
  } else if (res?.statusCode === 401) {
    errorObject.message = 'Unauthorized Access';
    errorObject.statusCode = 401;
    errorObject.errorMessage =
      'You do not have the necessary permissions to access this resource.';
    errorObject.errorDetails = null;
  }

  res.status(errorObject.statusCode).json({
    success: false,
    message: errorObject.message,
    errorMessage: errorObject.errorMessage,
    errorDetails: errorObject.errorDetails,
    stack: config.node_env === 'development' ? error.stack : null,
  });
};

export default globalErrorHandler;
