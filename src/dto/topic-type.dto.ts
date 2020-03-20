import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

import {TopicTypeEnum} from '../config/enum/TopicTypeEnum'

export class Topic {
  _id?: string;

  @IsString()
  @ApiProperty({description: '类型名称'})
  name: TopicTypeEnum;

}