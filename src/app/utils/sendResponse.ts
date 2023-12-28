import { Response } from 'express';

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, ...rest } = data;
  res.status(data?.statusCode).json({
    statusCode,
    success,
    message,
    ...rest,
  });
};

export default sendResponse;
