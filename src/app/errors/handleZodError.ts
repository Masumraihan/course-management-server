import { ZodError } from 'zod';
import { TErrorResponse } from '../types/ErrorResponse';

const handleZodError = (err: ZodError): TErrorResponse => {
  const errorMessage = err.issues
    .map(issue =>
      issue.path[issue.path.length - 1]
        ? `${issue.path[issue.path.length - 1]} is required`
        : issue.message,
    )
    .join('. ');
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessage: errorMessage,
    errorDetails: { issues: Object.values(err)[0] },
  };
};

export default handleZodError;
