/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Db } from 'mongodb';

import { COLLECTIONS } from '../../config/collections';
import { AuthModel } from '../models/AuthModel';
import { Repository } from '../repository/Repository';
import { Controller } from './Controller';
import { TOKEN_SCOPE } from '../../config/config';

import { verifyToken } from '../../utils/auth';
import { parseDuration } from '../../utils/time';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { UserRepository } from '../repository/UserRepository';
import { checkArgs } from '../../utils/utils';
import { AuthRepository } from '../repository/AuthRepository';

const {
  ACCESS_TOKEN_SECRET = '',
  REFRESH_TOKEN_SECRET = '',
  REFRESH_TOKEN_EXPIRACY = '7d',
  ACCESS_TOKEN_EXPIRACY = '15m',
} = process.env;

export class AuthController extends Controller<AuthModel> {
  constructor(db: Db) {
    const repository: Repository<AuthModel> = AuthRepository
      .getInstance<AuthModel>(COLLECTIONS.AUTH, db);
    super(repository);
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body } = req;
    const {
      username = null,
      password = null,
    } = body;

    try {
      // check required fields
      checkArgs(['username, password'], body, res);
      // user repository
      const userDb = UserRepository.getInstance(COLLECTIONS.USERS, req.db) as UserRepository;
      // error if user not found into ddbb
      const user = await userDb.getByUsername(username);
      if (!user) throw new Error('Missmatch: Wrong username or password');

      const validPassword = await bcrypt.compare(password, user.password);
      // error if given password does not match stored one
      if (!validPassword) throw new Error('Missmatch: Wrong username or password');
      // generate pair of access tokens and refresh tokens

      const { scope = null } = req.query;
      let options = {};

      if (scope !== TOKEN_SCOPE.PERMANENT) {
        options = { expiresIn: ACCESS_TOKEN_EXPIRACY };
      }

      const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, options);
      const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRACY });

      this.repository.post({
        _id: user._id,
        role: user.role,
        username,
        refreshToken,
        expiredAt: (DateTime.now().plus(parseDuration(REFRESH_TOKEN_EXPIRACY))).toJSDate(),
      });

      res.status(HttpStatusCode.OK).json({
        status: HttpStatusCode.OK,
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
      if (!token) throw new Error('Missing \'token\'');
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

  get = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
    next(new Error('Method not allowed.'));
  };

  getById = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
    next(new Error('Method not allowed.'));
  };

  post = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
    next(new Error('Method not allowed.'));
  };

  put = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
    next(new Error('Method not allowed.'));
  };
}
