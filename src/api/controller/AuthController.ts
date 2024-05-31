/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Db } from 'mongodb';
import { COLLECTIONS } from '../../config/collections';
import { UserModel } from '../models/UserModel';
import { verifyToken } from '../../utils/auth';
import { AuthModel } from '../models/AuthModel';
import { Repository } from '../repository/Repository';
import { IRepository } from '../interfaces/IRepository';

const {
  ACCESS_TOKEN_SECRET = '',
  REFRESH_TOKEN_SECRET = '',
} = process.env;

export class AuthController {
  repository: IRepository<AuthModel>;

  constructor(db: Db) {
    this.repository = Repository
      .getInstance(COLLECTIONS.AUTH, db);
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        username = null,
        password = null,
      } = req.body;

      if (!username || !password) {
        throw new Error(
          !username
            ? 'Missing \'password\' field'
            : 'Missing \'username\' field',
        );
      }

      // user repository
      const userDb: Repository<UserModel> = Repository
        .getInstance(COLLECTIONS.USERS, req.db);

      const user: UserModel| null = await userDb.getById(username as string);
      // error if user not found into ddbb
      if (!user) throw new Error('Missmatch: Wrong username or password');
      console.log(ACCESS_TOKEN_SECRET);

      const validPassword = await bcrypt.compare(password, user.password);
      // error if given password does not match stored one
      if (!validPassword) throw new Error('Missmatch: Wrong username or password');
      // generate pair of access tokens and refresh tokens
      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      this.repository.post({
        _id: username,
        role: user.role,
        username,
        refreshToken,
        expiredAt: DateTime.fromJSDate(new Date('2022-06-01')).plus({ days: 7 }).toJSDate(),
      });

      res.status(200).json({
        status: 200,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  generateAcessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      if (!token) throw new Error('Missing \'token\' field');
      const verified = await verifyToken(token, REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign(
        verified,
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
      );
      res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  };
}
