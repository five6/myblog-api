import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user/user.controller';
import { TopicController } from './topic/topic.controller';
import { ReplyController } from './reply/reply.controller';
import { TopicTypeController } from './topic-type/topic-type.controller';

import { UserService } from '../../service/user/user.service';
import { TopicService } from '../../service/topic/topic.service';
import { ReplyService } from 'src/service/reply/reply.service';
import { TopicTypeService } from 'src/service/topic-type/topic-type.service';
import { ToolsService } from '../../service/tools/tools.service';

import { UserSchema } from '../../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'topic', schema: UserSchema, collection: 'topic' },
      { name: 'topic_type', schema: UserSchema, collection: 'reply_type' },
      { name: 'reply', schema: UserSchema, collection: 'reply' },
    ]),
  ],
  controllers: [UserController, TopicController, ReplyController, TopicTypeController],
  providers: [UserService, TopicService, ReplyService, TopicTypeService, ToolsService],
  exports: [UserService, TopicService, ReplyService],
})
export class ApiModule { }
