import { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger.ts';

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
  logger.error(err);
  if (process.env.NODE_ENV !== 'production') logger.error(err.stack);
};
