import mongoose from 'mongoose';
import express from 'express';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './app.module';

let mongo: any = null;
let app: AppModule;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  app = new AppModule(express(), uri);
  await app.start();
});

afterAll(async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
});

const dropCollections = async () => {
  if (mongo) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany();
    }
  }
};

describe('Auth routes', () => {
  beforeEach(async () => {
    await dropCollections();
  });

  const register = async () => {
    return await request(app.app).post('/api/auth/register').send({
      email: 'test1234@gmail.com',
      password: 'samplepassword',
    });
  };
  describe('Register', () => {
    it('should register new user', async () => {
      const response = await request(app.app).post('/api/auth/register').send({
        email: 'test1234@gmail.com',
        password: 'samplepassword',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should not register user without email', async () => {
      const response = await request(app.app).post('/api/auth/register').send({
        password: 'samplepassword',
      });
      expect(response.body.errors.length).toBe(2);
      expect(response.status).toBe(400);
    });

    it('should not register user with wrong email', async () => {
      const response = await request(app.app).post('/api/auth/register').send({
        email: 'test3gmail.com',
        password: 'samplepassword',
      });
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe('a valid email is required');
      expect(response.status).toBe(400);
    });

    it('should not register user without password', async () => {
      const response = await request(app.app).post('/api/auth/register').send({
        email: 'test1234@gmail.com',
      });
      expect(response.body.errors.length).toBe(2);
      expect(response.status).toBe(400);
    });

    it('should not register user with to short password', async () => {
      const response = await request(app.app).post('/api/auth/register').send({
        email: 'test3@gmail.com',
        password: 'sam',
      });
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe('a valid password is required');
      expect(response.status).toBe(400);
    });

    it('should not register user when there is no body', async () => {
      const response = await request(app.app).post('/api/auth/register').send({});
      expect(response.body.errors.length).toBe(4);
      expect(response.status).toBe(400);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      await register();
      const response = await request(app.app).post('/api/auth/login').send({
        email: 'test1234@gmail.com',
        password: 'samplepassword',
      });

      const cookie = response.get('Set-Cookie');
      expect(cookie).not.toContain('expires=');
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should not login a user when password is wrong', async () => {
      await register();
      const response = await request(app.app).post('/api/auth/login').send({
        email: 'test1234@gmail.com',
        password: 'samplepassword1',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe('Wrong credentials');
    });

    it('should not login a user when there is no user with provided email', async () => {
      await register();
      const response = await request(app.app).post('/api/auth/login').send({
        email: 'nouser@gmail.com',
        password: 'samplepassword1',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe('Wrong credentials');
    });

    it('should not login when wrong email format provided', async () => {
      await register();
      const response = await request(app.app).post('/api/auth/login').send({
        email: 'test1234gmail.com',
        password: 'samplepassword',
      });

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0].message).toBe('a valid email is required');
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      await register();
      const response = await request(app.app).get('/api/auth/logout').expect(200);

      const cookies = response.get('Set-Cookie');
      const expiresCookie = cookies.find((cookie: string) => cookie.includes('expires='));
      expect(expiresCookie).toMatch(/expires=/);
    });
  });
});
