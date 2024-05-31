import { NextFunction, Request, Response } from 'express';

export const isUserMiddleware = (req : Request, res: Response, next: NextFunction) => {
  console.log('caca');
  next();
};

export const isClientMiddleware = (req : Request, res: Response, next: NextFunction) => {
  console.log('caca');
  next();
};

export const isAdminMiddleware = (req : Request, res: Response, next: NextFunction) => {
  console.log('caca');
  next();
};

