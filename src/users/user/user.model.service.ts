import {UserModel, User} from './user.model';
import {CreateUserDto, UpdateUserDto, DeleteUserDto} from '../dtos/user.dto';

export class UserModelService {
  constructor(public userModel: UserModel) { };

  async getOneById(userId: string) {
    return await this.userModel.findOne({_id: userId});
  };

  async getAllUsers(roleQuery?: string) {
    if (!roleQuery) {
      return await this.userModel.find({});
    }
    return await this.userModel.find({role: roleQuery});
  };

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      firstName: createUserDto.firstName || '',
      lastName: createUserDto.lastName || '',
      email: createUserDto.email,
      role: createUserDto.role
    });

    return await user.save();
  };

  async update(updateUserDto: UpdateUserDto) {
    const updateFields: any = {};

    if (typeof updateUserDto.firstName !== 'undefined') {
      updateFields.firstName = updateUserDto.firstName;
    };

    if (typeof updateUserDto.lastName !== 'undefined') {
      updateFields.lastName = updateUserDto.lastName;
    };

    if (typeof updateUserDto.role !== 'undefined') {
      updateFields.role = updateUserDto.role;
    };

    return await this.userModel.findOneAndUpdate(
      {_id: updateUserDto.userId},
      {$set: {...updateFields}},
      {new: true})
  }

  async delete(deleteUserDto: DeleteUserDto) {
    return await this.userModel.findOneAndRemove({_id: deleteUserDto.userId})
  };
};

export const userModelService = new UserModelService(User);