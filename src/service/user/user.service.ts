import { Injectable, Get, Logger, UseGuards, Request, Post, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../interface/user.interface';
import { Pagination } from '../../config/result-beans/Pagination';

@Injectable()
export class UserService {
  logger = new Logger();
  constructor(@InjectModel('User') private readonly userModel) { }


  async findOne(user: any) {
    const u = await this.userModel.findOne({$or: [{ username: user.username }, {email: user.username }]}).exec();
    if (u && u.authenticate(user.password)) {
        return u;
    }
    return false;
  }

  async find(json: User = {}, fields: string = '', pagination: Pagination = { currentPage: 1, pageSize: 10 }) {
    try {
      const skip = (pagination.currentPage - 1) * pagination.pageSize;
      return Promise.all([
        this.userModel.find(json, fields).skip(skip).limit(pagination.pageSize),
        this.userModel.count(json),
      ]);
    } catch (error) {
      this.logger.error(error);
      return [[], 0];
    }
  }

  async signup(userDto: UserDto) {
    const model = this.userModel(userDto)
    const salt = model.makeSalt();
    model.salt = salt;
    model.password = model.encryptPassword(model.password);
    return await this.userModel.create(model); // model.save();
  }

  async signout() {
  }

}
