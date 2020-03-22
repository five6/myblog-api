import { Controller, Get, Param, Query, Post, Body, Request, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user.interface';
import { UserDto } from '../../../dto/user.dto';
import { Pagination } from '../../../config/result-beans/Pagination';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { AuthService } from '../../../service/auth/auth.service';
import { Result } from 'src/config/result-beans/Result';
@Controller('frontend/users')
export class UserController {
  logger = new Logger();
  constructor(private userService: UserService, private authService: AuthService) { }


  @Post('login')
  async login(@Body() body) {
    const user = await this.userService.findOne({username: body.username, password: body.password});
    if(!user) 
      throw new UnauthorizedException();
    return this.authService.login(body);
  }

  @Post('register')
  async create(@Body() user: UserDto) {
    const u =  await this.userService.create(user);
    if(u)
      return new Result({
        datas: {
          username: u.username,
          password: user.password
        },
        code: 0,
        msg: '注册成功',
      });
    return u;
  }

  @Get(':id')
  @ApiParam({ name: '用户id' })
  async findOne(@Param('id') id) {
    return this.userService.findOne(id);
  }

  @Get()
  async find(userInterface: User, @Query('pagination') pagination: Pagination) {
    const fields = '';
    const items = await this.userService.find(userInterface, fields, pagination);
    return  new ResultPagination({
      items: items[0],
      totalCount: items[1],
      code: 0,
      msg: '获取用户信息成功',
    });
  }

}
