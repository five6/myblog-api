import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class Topic {
  _id?: string;

  @IsString()
  @ApiProperty({description: '回复目标id'})
  reply_id: string;

  @IsString()
  @ApiProperty({description: '回复类型'})
  reply_type: string;

  @ApiProperty({description: '回复内容'})
  @IsString()
  content: string;

  @ApiProperty({description: '回复用户id'})
  @IsString()
  from_uid: string;

  @ApiProperty({description: '目标用户id'})
  @IsString()
  to_uid: string;

  @IsString()
  isDeleted: boolean

}