import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsBoolean } from 'class-validator';

export class Topic {
  _id?: string;

  @IsString()
  @ApiProperty({description: '文章类型'})
  topic_type: string;

  @IsString()
  @ApiProperty({description: '文章标题'})
  title: string;

  @IsString()
  @ApiProperty({description: '文章内容'})
  content: string;

  @IsBoolean()
  @ApiProperty({description: '是否置顶'})
  put_top: boolean;

  @IsString()
  @ApiProperty({description: '用户id'})
  from_uid : string;


}