import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../interface/user.interface';
import { ApiParam } from '@nestjs/swagger';
import { UserDto } from 'src/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get(':id')
  @ApiParam({ name: '用户id' })
  async findOne(@Param('id') id) {
    return this.userService.findOne(id);
  }

  @Get()
  async find(userInterface: User, @Query('pageSize') pageSize: number, @Query('currentPage') currentPage: number) {
    const fields = '';
    console.log(pageSize, pageSize);
    const items = await this.userService.find(userInterface, fields, currentPage, pageSize);
    return {
      items: items[0],
      totalCount: items[1]
    }
  }

  @Post()
  async create(@Body() user: UserDto) {
    return this.userService.create(user);
  }
}
