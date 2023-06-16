import {Request, Response, NextFunction} from 'express';
import {RouteNotFoundError} from '../errors';

export const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  throw new RouteNotFoundError();
};