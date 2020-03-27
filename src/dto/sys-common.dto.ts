import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsArray } from 'class-validator';

import {SysCommonTypEnum} from '../config/enum/SysCommonTypEnum'

export class SysCommonDto {
  _id?: string;

  @IsString()
  @ApiProperty({description: '系统通知类型'})
  type: SysCommonTypEnum;

  @IsString()
  @ApiProperty({description: '系统通知标题'})
  title: string;

  @IsArray()
  @ApiProperty({description: '图片信息'})
  images

  @IsString()
  @ApiProperty({description: '图文内容'})
  content: string;

  @IsString()
  @ApiProperty({description: '外链地址'})
  externalLinkAddress: string;

  @IsString()
  @ApiProperty({description: '创建时间'})
  createTime: number;

  @IsString()
  @ApiProperty({description: '修改时间'})
  updateTime: number;



}