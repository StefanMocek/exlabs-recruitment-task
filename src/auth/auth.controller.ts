import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { BadRequestError, CustomError } from '../utils/errors';

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await authService.register({ email, password });

    if (result instanceof CustomError) {
      return next(result);
    }

    req.session = { jwt: result.jwt };

    res.status(201).json({ success: true });
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const result = await authService.signin({ email, password });

    if (result instanceof CustomError) {
      return next(result);
    }

    req.session = { jwt: result.jwt };

    res.status(201).json({ success: true });
  }

  public async getCurrentUser(req: Request, res: Response) {
    res.status(200).send(req.currentUser);
  }

  public async logout(req: Request, res: Response) {
    req.session = null;
    res.send({ success: true });
  }
}

export default new AuthController();
