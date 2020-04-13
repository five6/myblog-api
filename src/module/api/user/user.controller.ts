import { Controller, Get, Param, Query, Post, Body, Request, UnauthorizedException, Logger, UseGuards, Response, Session } from '@nestjs/common';

import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user.interface';
import { UserDto } from '../../../dto/user.dto';
import { Pagination } from '../../../config/result-beans/Pagination';
import { ResultPagination } from '../../../config/result-beans/ResultPagination';
import { AuthService } from '../../common/auth/auth.service';
import { Result } from '../../../config/result-beans/Result';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';
import { Topic } from '../../../interface/topic.interface';
import { TopicService } from '../../../service/topic/topic.service';
import { ToolsService } from '../../../service/tools/tools.service';
import { Config } from '../../../config/config';

@Controller('frontend/users')
export class UserController {
  logger = new Logger();
  constructor(private userService: UserService, 
    private authService: AuthService,
    private toolService: ToolsService,
    private topicService: TopicService) { }
  
  @Get('captcha')
  index(@Request() req, @Response() res) {
      const captcha = this.toolService.getCaptcha();
      req.session.code = captcha.text;
      res.type('image/svg+xml');
      res.send(captcha.data);
  }

  @Get('validate/account/:id')
  async validateAccount(@Param('id') unValidateEmailToken: String, @Response() res) {
      await this.userService.validateAccount(unValidateEmailToken);
      return {
        datas: null,
        code: 0,
        msg: '恭喜，您的账户已经完成注册！'
      };
  }



  @Post('signin')
  async login(@Body() body, @Session() session): Promise<Result> {
    if(body.captcha !== session.code) {
      return {
        datas: null,
        code: -1,
        msg: '验证码不正确！'
      };
    };
    const user = await this.userService.findOne({username: body.username, password: body.password});
    if(!user) {
      return {
        datas: null,
        code: -1,
        msg: '用户名不存在或密码错误！'
      };
    }// 当用户禁用提示用户账号被锁定
     else if(user.locked) {
        return {
          datas: null,
          code: -1,
          msg: '用户已被锁定，禁止登录'
        };
    }  else if(user.unValidateEmail) {
      return {
        datas: null,
        code: -1,
        msg: '用户尚未激活，请激活后重试'
      };
    }
    const obj = await this.authService.signin(user);
    if(obj && obj.access_token) {
      const ret = await this.userService.update({_id: user._id, jwtToken: obj.access_token});
      return {
        datas: obj.access_token,
        code: 0,
        msg: '登录成功'
      };
    }
    return {
        datas: null,
        code: -1,
        msg: '登录失败'
    };
  }

  @Post('signup')
  async signup(@Body() user, @Session() session) {
    if(user.captcha !== session.code) {
      return {
        datas: null,
        code: -1,
        msg: '验证码不正确！'
      };
    };
    const u =  await this.userService.signup(user);
    if(u) {
      this.toolService.sendEmailToUser(user.email, user.username, user.password,`${Config.http_server}/${Config.api_prefix}/frontend/users/validate/account/${u.unValidateEmailToken}`);
      return new Result({
        datas: {
          username: u.username,
          // password: user.password,
          email: u.email
        },
        code: 0,
        msg: '注册成功',
      });
    }
     
    return new Result({
      datas: null,
      code: -1,
      msg: '注册失败',
    });
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

  @Get('topics')
  @UseGuards(AuthGuard('jwt'))
  async userTopics(@Request() req, @Query() topic: Topic, @Query('pageSzie') pageSize?: number, @Query('currentPage') currentPage?: number): Promise<ResultPagination> {
      const user = await this.userService.findOne({username: req.user.username, password: req.user.password});
      const cond = {
          from_uid: user._id,
          isDeleted: false
      };
      if(topic.type) {
          cond['type']= topic.type;
      }
      if(topic.from_uid) {
          cond['from_uid'] = topic.from_uid;
      }
      if(topic.put_top) {
          cond['put_top'] = topic.put_top;
      }
      const t = await this.topicService.findUserTopic(cond, '', new Pagination({currentPage, pageSize}));
      return {
          items: t[0],
          totalCount: t[1],
          code: 0,
          msg: '获取主题列表成功',
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
        return _.omit(user, ['salt', 'password']);
      }),
      totalCount: items[1],
      code: 0,
      msg: '获取用户信息成功',
    });
  }

  @Get('check/authorized')
  @UseGuards(AuthGuard('jwt'))
  async checkUserAuthorized() {
    return {
      datas: null,
      code: 0,
      msg: '用户获取成功'
    };
  }

  
}
