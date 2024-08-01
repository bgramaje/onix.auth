import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { Role } from '../models/RoleModel';

export const isClientMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { self = null }: { self: UserModel | null } = req;
  if (!self) {
    res.status(403);
    next(new Error('Error: You are not authenticated in the server'));
  } else if (self.role === Role.Client) {
    next();
  } else {
    res.status(403);
    next(new Error('Not allowed'));
  }
};

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { self = null }: { self: UserModel | null } = req;
  if (!self) {
    res.status(403);
    next(new Error('Error: You are not authenticated in the server'));
  } else if (self.role === Role.Admin || self.role === Role.Super) {
    next();
  } else {
    res.status(403);
    next(new Error('Not allowed'));
  }
};

export const isSuperMiddlware = (req: Request, res: Response, next: NextFunction) => {
  const { self = null }: { self: UserModel | null } = req;
  
  if (!self) {
    res.status(403);
    next(new Error('Error: You are not authenticated in the server'));
  } else if (self.role === Role.Super) {
    next();
  } else {
    res.status(403);
    next(new Error('Not allowed'));
  }
};

