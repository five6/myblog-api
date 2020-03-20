import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class UserDto {
  _id?: string;

  @IsString()
  @ApiProperty({description: '用户昵称'})
  nickName: string;

  @IsInt()
  @ApiProperty({description: '用户性别'})
  gender?: number;

  @IsString()
  @ApiProperty({description: '语言'})
  language?: string;

  @IsString()
  @ApiProperty({description: '用户所在城市'})
  city?: string;

  @IsString()
  @ApiProperty({description: '用户所在省份'})
  province?: string;

  @IsString()
  @ApiProperty({description: '用户所在国家'})
  country?: string;

  @IsString()
  @ApiProperty({description: '用户头像地址'})
  avatarUrl?: string;

  @IsInt()
  @ApiProperty({description: '用户手机号'})
  mobile?: number;

  @IsInt()
  @ApiProperty({description: '注册时间'})
  ctime?: number;
}