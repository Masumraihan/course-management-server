/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import duplicateError from '../errors/duplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { TErrorResponse } from '../types/ErrorResponse';
//import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let errorObject: TErrorResponse = {
    statusCode: 400,
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
  }

  res.status(errorObject.statusCode).json({
    success: false,
    message: errorObject.message,
    errorMessage: errorObject.errorMessage,
    errorDetails: errorObject.errorDetails,
    //stack: config.node_env === 'development' ? error.stack : null,
    stack: error.stack,
    error,
  });
};

export default globalErrorHandler;
