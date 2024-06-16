import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../../enums/HttpStatusCode';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatusCode.NOT_FOUND);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};
