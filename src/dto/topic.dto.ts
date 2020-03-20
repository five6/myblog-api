import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class Topic {
  _id?: string;

  @IsString()
  @ApiProperty({description: '文章标题'})
  title: string;

  @IsString()
  @ApiProperty({description: '文章内容'})
  content: string;

  @IsString()
  @ApiProperty({description: '用户id'})
  from_uid : string;


}