import * as dotenv from 'dotenv';
dotenv.config();

import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';

//routers
import {authRouter} from './auth/auth.routes';
import {errorHandler, handleNotFound} from './utils/middlewares';
import {DatabaseConnectionError} from './utils/errors';

const PORT = process.env.PORT || 3000;

export class AppModule {
  constructor(public app: Application, private dbUri: string) {
    //basic settings
    app.set('trust proxy', true);
    app.use(cors())
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(cookieSession({
      signed: false,
      secure: false
    }));
  };

  async start() {
    //check if JWT_KEY is present if not app wont start
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY is required')
    };

    try {
      await mongoose.connect(this.dbUri)
    } catch (error) {
      //if dbUri is not provided app wont start
      throw new DatabaseConnectionError()
    };

    //temporary
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome')
    });

    //main routers
    this.app.use('/api/auth', authRouter);

    //handle non-existent url
    this.app.use(handleNotFound);
    //error handler
    this.app.use(errorHandler);

    this.app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  };
};