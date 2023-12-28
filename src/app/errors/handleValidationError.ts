import mongoose from 'mongoose';
import { TErrorResponse, TIssue } from '../types/ErrorResponse';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TErrorResponse => {
  const errorDetails: TIssue[] = Object.values(err.errors).map(val => {
    return Object.values(val)[0];
  });
  return {
    statusCode: 400,
    message: err.name,
    errorMessage: err.message,
    errorDetails: { issues: errorDetails, name: err.name },
  };
};

export default handleValidationError;
