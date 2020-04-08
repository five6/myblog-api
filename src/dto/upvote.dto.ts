import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class UpvoteDto {
  _id?: string;

  @IsString()
  @ApiProperty({description: '文章id'})
  topic_id: string;


  @ApiProperty({description: '回复用户id'})
  @IsString()
  from_uid: string;

  @ApiProperty({description: '推荐状态： 1 推荐，0 取消推荐'})
  @IsString()
  status: number;

  @IsInt()
  registerTime?: number;
}