import { Request, Response } from 'express';

const notFoundError = (req: Request, res: Response) => {
  res.status(200).json({
    success: false,
    message: 'Not Found',
    errorMessage: `${req.originalUrl} routes is not found`,
  });
};
export default notFoundError;
