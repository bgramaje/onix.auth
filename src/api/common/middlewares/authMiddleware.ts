import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../models/UserModel';
import { HttpStatusCode } from '../../enums/HttpStatusCode';

const {
  ACCESS_TOKEN_SECRET = '',
} = process.env;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(HttpStatusCode.UNAUTHORIZED);
    next(new Error('Access denied. No token provided.'));
    return;
  }

  try {
    const decoded: string | JwtPayload & Partial<UserModel> = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.self = decoded;
    next();
  } catch (error) {
    res.status(HttpStatusCode.FORBIDDEN);
    next(new Error('Not Allowed: Invalid token'));
  }
};
