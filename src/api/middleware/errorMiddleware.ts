import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
  logger.error(err);
};