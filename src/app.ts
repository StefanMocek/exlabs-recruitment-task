import path from 'path';
import express from 'express';
import { AppModule } from './app.module';
import { JwtPayload } from './utils/globals';

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload;
    }
  }
}
const PORT = process.env.PORT || 3000;
const swaggerDocPath = path.join(__dirname, '../../swagger.yaml');

const boostrap = async () => {
  //check if JWT_KEY is present if not app wont start
  //real mongo DB will be connected here for tests purpose
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is require');
  }
  const app = new AppModule(express(), process.env.MONGO_URL, swaggerDocPath);
  await app.start();
  app.app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

boostrap();
