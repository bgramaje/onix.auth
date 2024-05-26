import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger.ts';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};
