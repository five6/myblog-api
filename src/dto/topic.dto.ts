import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsBoolean, IsNumber } from 'class-validator';
import { TopicTypeEnum } from 'src/config/enum/TopicTypeEnum';
import { TopicLevelEnum } from 'src/config/enum/TopicLevelEnum';


export class TopicDto {
  _id?: string;

  @IsString()
  @ApiProperty({description: '文章类型', required: true})
  topic_type: {
    type: TopicTypeEnum,
  };

  @IsString()
  @ApiProperty({description: '文章标题', required:  true})
  title: {
    type: string,
    required: true
  };

  @IsString()
  @ApiProperty({description: '文章内容', required: true})
  content: {
    type: string,
    required: true
  };

  @IsBoolean()
  @ApiProperty({description: '是否置顶', required: false})
  put_top: boolean;

  @IsString()
  @ApiProperty({description: '用户id', required: true})
  from_uid : {
    type: string,
    required: true
  };

  @IsString()
  topicLevel : {
    type: TopicLevelEnum,
    required: true,
  };

  @IsBoolean()
  isDeleted : {
    type: Boolean,
    required: true,
  };


}