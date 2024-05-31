import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const {
  ACCESS_TOKEN_SECRET = '',
} = process.env;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401);
    next(new Error('Access denied. No token provided.'));
    return;
  }

  try {
    const decoded: string | JwtPayload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.entity = decoded;
    next();
  } catch (error) {
    res.status(400);
    next(new Error('Invalid token'));
  }
};
