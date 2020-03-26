import { Controller, Get, Param, Query, Post, Body, Request, UnauthorizedException, Logger, UseGuards } from '@nestjs/common';

import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user.interface';
import { UserDto } from '../../../dto/user.dto';
import { Pagination } from '../../../config/result-beans/Pagination';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { AuthService } from '../../common/auth/auth.service';
import { Result } from '../../../config/result-beans/Result';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';

@Controller('frontend/users')
export class UserController {
  logger = new Logger();
  constructor(private userService: UserService, private authService: AuthService) { }


  @Post('signin')
  async login(@Body() body) {
    const user = await this.userService.findOne({username: body.username, password: body.password});
    if(!user) 
      throw new UnauthorizedException();
    return this.authService.signin(body);
  }

  @Post('signup')
  async signup(@Body() user: UserDto) {
    const u =  await this.userService.signup(user);
    if(u)
      return new Result({
        datas: {
          username: u.username,
          password: user.password
        },
        code: 0,
        msg: '注册成功',
      });
    return new Result({
      datas: null,
      code: -1,
      msg: '注册失败',
    });
  }

  @Get('signout')
  @UseGuards(AuthGuard('jwt'))
  async signout(@Body() userDto: UserDto) {
      return this.authService.signout();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async currentUser(@Request() req): Promise<Result> {
    const user = await this.userService.findOne({username: req.user.username, password: req.user.password});
    return {
      datas: user ? _.omit(user.toJSON(), ['password', 'salt']): null,
      code: user ? 0:  -1,
      msg:  user ? '获取用户信息成功！' : '获取用户信息失败'
    }
  }



  @Get()
  @UseGuards(AuthGuard('jwt'))
  async find(@Query() query: any, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number) {
    const fields = '';
    const cond = {};
    if(query.username) {
      cond['username'] = query.username;
    }
    const items = await this.userService.find(cond, fields, new Pagination({currentPage, pageSize}));
    return  new ResultPagination({
      items: _.map(items[0], user => {
        return _.omit(user.toJSON(), ['salt', 'password']);
      }),
      totalCount: items[1],
      code: 0,
      msg: '获取用户信息成功',
    });
  }

}
