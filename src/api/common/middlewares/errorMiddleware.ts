import { NextFunction, Request, Response } from 'express';
import { logger } from '../../../config/logger';

export const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const debug = process.env.NODE_ENV !== 'production' && req.debug;
  res.json({
    status: res.statusCode,
    message: err.message,
    stack: debug ? err.stack : null,
  });

  if (debug) logger.error(err.stack);
};
