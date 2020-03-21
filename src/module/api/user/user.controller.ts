import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user.interface';
import { ApiParam } from '@nestjs/swagger';
import { UserDto } from 'src/dto/user.dto';
import { Pagination } from '../../../config/result-beans/Pagination';
import { ResultPagination } from 'src/config/result-beans/ResultPagination';
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

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

  @Post()
  async create(@Body() user: UserDto) {
    return this.userService.create(user);
  }
}
