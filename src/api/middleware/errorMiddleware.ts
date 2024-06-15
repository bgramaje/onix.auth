import { NextFunction, Request, Response } from 'express';
import { logger } from '../../config/logger.ts';

export const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
  if (process.env.NODE_ENV !== 'production' && req.debug) logger.error(err.stack);
};
