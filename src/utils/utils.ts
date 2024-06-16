import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export const verifyToken = async (token: string, key: string): Promise<string | JwtPayload> => {
  if (!token) return {};
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, decoded) => (err || !decoded ? reject() : resolve(decoded)));
  },
  );
};

// eslint-disable-next-line consistent-return
// try-catch to capture poosible excepction when malformed json as string
/**
 * @description it parses args from req.query into JS json object
 * @param name string for printing error name in response
 * @param args header param of request to be parsed
 * @param res Express Response object
 * @param next Express Next Function
 * @returns parsed args if no error
 */
export const parseArgs = (name: string, args: string, res: Response, next: NextFunction) => {
  try {
    const parsed = JSON.parse(args);
    return parsed;
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST);
    next(new Error(`Malformed '${name}' json field.`));
  }
};
