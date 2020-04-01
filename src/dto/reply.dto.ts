import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ReplyDto {
  _id?: string;

  @IsString()
  @ApiProperty({description: '回复的文章id'})
  topic_id: string;

  @ApiProperty({description: '回复内容'})
  @IsString()
  content: string;

  @ApiProperty({description: '回复用户id'})
  @IsString()
  from_uid: string;

  @ApiProperty({description: '目标用户id'})
  @IsString()
  to_uid: string;

  @ApiProperty({description: '所回复的comment的ID'})
  @IsString()
  parent_reply_id: string;

  @ApiProperty({description: '被回答的commentID'})
  @IsString()
  reply_level: number;

  @ApiProperty({description: '点赞数量'})
  @IsString()
  like_num:number

  @ApiProperty({description: '是否是置顶回答'})
  @IsString()
  put_top: boolean

}