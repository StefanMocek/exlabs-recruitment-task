import express from "express";
import {AppModule} from "./app.module";

const boostrap = async () => {
  //check if JWT_KEY is present if not app wont start
  //real mongo DB will be connected here for tests purpose
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is require')
  };
  const app = new AppModule(express(), process.env.MONGO_URL);
  await app.start();
};

boostrap();