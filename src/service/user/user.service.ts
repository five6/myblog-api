import { Injectable, Get, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../interface/user.interface';
import { UserDto } from 'src/dto/user.dto';
import { Pagination } from '../../config/result-beans/Pagination';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel) { }

  @Get()
  async findOne(json: User = {}, fields?: string) {
    try {
      return await this.userModel.find(json, fields);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async find(json: User = {}, fields: string = '', pagination: Pagination = { currentPage: 1, pageSize: 10 }) {
    try {
      const skip = (pagination.currentPage - 1) * pagination.pageSize;
      console.log(pagination);
      return Promise.all([
        this.userModel.find(json, fields).skip(skip).limit(pagination.pageSize),
        this.userModel.count(json),
      ]);
    } catch (error) {
      // Logger.error();
      return [[], 0];
    }
  }

  async create(userDto: UserDto) {
    return this.userModel.create(userDto);
  }
}
