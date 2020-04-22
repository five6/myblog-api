import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '../../service/user/user.service';
import { TopicService } from '../../service/topic/topic.service';
import { ReplyService } from '../../service/reply/reply.service';
import { TopicTypeService } from '../../service/topic-type/topic-type.service';

import { UserSchema } from '../../schema/user.schema';
import { ToolsService } from '../../service/tools/tools.service';
import { AdminauthMiddleware } from '../../middleware/adminauth.middleware';
import { UserController } from './user/user.controller';
import { TopicSchema } from '../../schema/topic.schema';
import { SysCommonSchema } from '../../schema/sys-common.schema';
import { ReplySchema } from '../../schema/reply.schema';
import { UpvoteSchema } from '../../schema/upvote.schema';

import { SpecailSubjectSchema } from '../../schema/special-subject.schema';
import { SubeSpecailSubjectSchema } from '../../schema/sub-special-subject.schema';
import { SpecailSubjectTopicSchema } from '../../schema/special-subject-topic.schema';
import { specialSubjectReplySchema } from '../../schema/special-subject-reply.schema';
import { SpecialSubjectTopicUpvoteSchema } from '../../schema/special-subject-topic-upvote.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'Topic', schema: TopicSchema, collection: 'topic' },
      { name: 'SysCommon', schema: SysCommonSchema, collection: 'sys-common' },
      { name: 'Reply', schema: ReplySchema, collection: 'reply' },
      { name: 'Upvote', schema: UpvoteSchema, collection: 'upvote' },


      // 专题
      { name: 'SpecialSubject', schema: SpecailSubjectSchema, collection: 'special_subject' },
      { name: 'SubSpecialSubject', schema: SubeSpecailSubjectSchema, collection: 'sub_special_subject' },
      { name: 'SpecialSubjectTopic', schema: SpecailSubjectTopicSchema, collection: 'special_subject_topic' },
      { name: 'SpecialSubjectReply', schema: specialSubjectReplySchema, collection: 'reply' },
      { name: 'SpecialSubjectTopicUpvote', schema: SpecialSubjectTopicUpvoteSchema, collection: 'special_subject_topic_upvote' },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, TopicService, ReplyService, TopicTypeService, ToolsService],
  exports: [UserService, TopicService, ReplyService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .exclude(
        { path: 'api/v1/admin/users/login', method: RequestMethod.POST },
        { path: 'api/v1/admin/users/captcha', method: RequestMethod.GET },
      )
      /***
       * forRoutes可以使用 controller 也可使用path
       * forRoutes({ path: 'cats', method: RequestMethod.GET });
       */
      .forRoutes(UserController);
  }
}
