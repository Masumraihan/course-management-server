/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = await schema.safeParseAsync(req.body);
    if (!validatedData.success) {
      next(validatedData.error);
    } else {
      req.body = validatedData.data;
      next();
    }
  };
};

export default validateRequest;
