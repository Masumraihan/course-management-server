/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorResponse } from '../types/ErrorResponse';

const duplicateError = (err: any): TErrorResponse => {
  const regex = /"(.*?)"/;
  const matches = err.message.match(regex);
  return {
    statusCode: 400,
    message: 'Duplicate Error',
    errorMessage: `Duplicate value for ${matches[1]} field`,
    errorDetails: {},
  };
};

export default duplicateError;
