import {Request, Response, NextFunction} from 'express';
import {UsersController} from './users.controller';
import {usersService} from './users.service';
import {NotFoundError} from '../utils/errors';

jest.mock('./users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    usersController = new UsersController();
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should call usersService.getAll with role from query parameter and send the result', async () => {
      const role = 'user';
      const result = [{id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'user'}];
      req.query = {role};

      (usersService.getAll as jest.Mock).mockResolvedValue(result);

      await usersController.getAllUsers(req, res, next);

      expect(usersService.getAll).toHaveBeenCalledWith(role);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(result);
    });
  });

  describe('getSingleUser', () => {
    it('should call usersService.getSingleUser with id from params and send the result if not an instance of CustomError', async () => {
      const id = '1';
      const result = {id, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'user'};
      req.params = {id};

      (usersService.getSingleUser as jest.Mock).mockResolvedValue(result);

      await usersController.getSingleUser(req, res, next);

      expect(usersService.getSingleUser).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(result);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call usersService.getSingleUser with id from params and call next with the result if it is an instance of CustomError', async () => {
      const id = 'non-existent-id';
      const result = new NotFoundError();
      req.params = {id};

      (usersService.getSingleUser as jest.Mock).mockResolvedValue(result);

      await usersController.getSingleUser(req, res, next);

      expect(usersService.getSingleUser).toHaveBeenCalledWith(id);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(result);
    });
  });

  describe('addUser', () => {
    it('should call usersService.createUser with data from req.body and send the result', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
      };
      const createdUser = {...createUserDto, id: '1'};
      req.body = createUserDto;

      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);

      await usersController.addUser(req, res, next);

      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should call usersService.updateUser with data from req.body and send the result if not an instance of CustomError', async () => {
      const updateUserDto = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };
      const updatedUser = {...updateUserDto, id: '1'};
      req.body = updateUserDto;
      const id = '1';
      req.params = {id};

      (usersService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await usersController.updateUser(req, res, next);

      expect(usersService.updateUser).toHaveBeenCalledWith(updateUserDto);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(updatedUser);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call usersService.updateUser with data from req.body and call next with the result if it is an instance of CustomError', async () => {
      const updateUserDto = {
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };
      const result = new NotFoundError();
      req.body = updateUserDto;
      const id = '1';
      req.params = {id};

      (usersService.updateUser as jest.Mock).mockResolvedValue(result);

      await usersController.updateUser(req, res, next);

      expect(usersService.updateUser).toHaveBeenCalledWith(updateUserDto);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(result);
    });
  });

  describe('deleteUser', () => {
    it('should call usersService.deleteUser with id from params and send true', async () => {
      const id = '1';
      req.params = {id};

      (usersService.deleteUser as jest.Mock).mockResolvedValue({});

      await usersController.deleteUser(req, res, next);

      expect(usersService.deleteUser).toHaveBeenCalledWith({userId: id});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(true);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call usersService.deleteUser with id from params and call next with the result if it is an instance of CustomError', async () => {
      const id = 'non-existent-id';
      const result = new NotFoundError();
      req.params = {id};

      (usersService.deleteUser as jest.Mock).mockResolvedValue(result);

      await usersController.deleteUser(req, res, next);

      expect(usersService.deleteUser).toHaveBeenCalledWith({userId: id});
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(result);
    });
  });
});
