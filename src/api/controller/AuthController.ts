import { NextFunction, Request, Response } from 'express';


export class AuthController {
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    } catch (error) {
      next(error);
    }
  };
}
