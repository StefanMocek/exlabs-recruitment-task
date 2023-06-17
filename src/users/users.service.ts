import {UserModelService, userModelService} from "./user/user.model.service";
import {CreateUserDto, UpdateUserDto, DeleteUserDto} from './dtos/user.dto';
import {BadRequestError, NotFoundError} from '../utils/errors';

export class UsersService {
  constructor(
    public userModelService: UserModelService
  ) { };

  getAll(role?: string) {
    return this.userModelService.getAllUsers(role);
  };

  async getSingleUser(userId: string) {
    const user = await this.userModelService.getOneById(userId);
    if (!user) {
      return new NotFoundError();
    }
    return user;
  };

  createUser(createUserDto: CreateUserDto) {
    return this.userModelService.create(createUserDto);
  };

  async updateUser(updateUserDto: UpdateUserDto) {
    const user = await this.userModelService.getOneById(updateUserDto.userId);
    if (!user) {
      return new NotFoundError();
    };

    if (!updateUserDto.firstName && !updateUserDto.lastName && !updateUserDto.role) {
      return new BadRequestError('You should provide at least one property');
    };

    return this.userModelService.update(updateUserDto);
  };

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const user = await this.userModelService.getOneById(deleteUserDto.userId);
    if (!user) {
      return new NotFoundError();
    };

    return this.userModelService.delete(deleteUserDto);
  }
};

export const usersService = new UsersService(userModelService);

