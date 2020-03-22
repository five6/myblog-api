import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '../../service/user/user.service';
import { TopicService } from '../../service/topic/topic.service';
import { ReplyService } from 'src/service/reply/reply.service';
import { TopicTypeService } from 'src/service/topic-type/topic-type.service';

import { UserSchema } from '../../schema/user.schema';
import { ToolsService } from 'src/service/tools/tools.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'topic', schema: UserSchema, collection: 'topic' },
      { name: 'topic_type', schema: UserSchema, collection: 'reply_type' },
      { name: 'reply', schema: UserSchema, collection: 'reply' },
    ]),
  ],
  controllers: [],
  providers: [UserService, TopicService, ReplyService, TopicTypeService,ToolsService],
  exports: [UserService, TopicService, ReplyService],
})
export class AdminModule {

}
