import { Injectable, Get, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../interface/user.interface';
import { UserDto } from 'src/dto/user.dto';

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

  async find(json: User = {}, fields: string = '', pageSize: number = 10, currentPage: number = 0) {
    try {
      const skip = (currentPage - 1) * pageSize;
      return Promise.all([
        this.userModel.find(json).skip(skip).limit(pageSize),
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
