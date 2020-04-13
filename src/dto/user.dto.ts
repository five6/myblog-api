import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UserDto {
  _id?: string;

  @IsString()
  @ApiProperty({description: '用户昵称'})
  username: string;

  @IsString()
  @ApiProperty({description: '用户密码'})
  password: string;

  @IsString()
  @ApiProperty({description: '用户昵称'})
  nickName: string;

  @IsInt()
  @ApiProperty({description: '用户性别'})
  gender?: number;

  @IsEmail()
  @ApiProperty({description: '用户邮箱'})
  email: string;

  @IsString()
  @ApiProperty({description: '用户头像地址'})
  avatarUrl?: string;

  @IsInt()
  @ApiProperty({description: '用户手机号'})
  mobile?: number;

  @IsString()
  @ApiProperty({description: '用户jwt token'})
  jwtToken?: string

  @IsInt()
  registerTime?: number;

  locked : {
    type: Boolean,
    required: true,
  };
}
