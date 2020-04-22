import { Module, LoggerService, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


import { UserController } from './user/user.controller';
import { TopicController } from './topic/topic.controller';
import { ReplyController } from './reply/reply.controller';
import { TopicTypeController } from './topic-type/topic-type.controller';
import { SysCommonController } from './sys-common/sys-common.controller';

import { UserService } from '../../service/user/user.service';
import { TopicService } from '../../service/topic/topic.service';
import { ReplyService } from '../../service/reply/reply.service';
import { TopicTypeService } from '../../service/topic-type/topic-type.service';
import { ToolsService } from '../../service/tools/tools.service';

import { UserSchema } from '../../schema/user.schema';
import { AuthModule } from '../common/auth/auth.module';
import { AuthService } from '../common/auth/auth.service';
import { jwtConstants } from '../common/auth/constants';
import { Config } from '../../config/config';
import { SysCommonSchema } from '../../schema/sys-common.schema';
import { SysCommonService } from '../../service/sys-common/sys-common.service';
import { UpvoteSchema } from '../../schema/upvote.schema';
import {ApiAuthMiddleware} from '../../middleware/apiauth.middleware';
import { TopicSchema } from '../../schema/topic.schema';
import { ReplySchema } from '../../schema/reply.schema';
import { SpecailSubjectSchema } from '../../schema/special-subject.schema';
import { SubeSpecailSubjectSchema } from '../../schema/sub-special-subject.schema';
import { SpecailSubjectTopicSchema } from '../../schema/special-subject-topic.schema';
import { specialSubjectReplySchema } from '../../schema/special-subject-reply.schema';
import { SpecialSubjectTopicUpvoteSchema } from '../../schema/special-subject-topic-upvote.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'SysCommon', schema: SysCommonSchema, collection: 'sys-common' },

      { name: 'Topic', schema: TopicSchema, collection: 'topic' },
      { name: 'Reply', schema: ReplySchema, collection: 'reply' },
      { name: 'Upvote', schema: UpvoteSchema, collection: 'upvote' },

      // 专题
      { name: 'SpecialSubject', schema: SpecailSubjectSchema, collection: 'special_subject' },
      { name: 'SubSpecialSubject', schema: SubeSpecailSubjectSchema, collection: 'sub_special_subject' },
      { name: 'SpecialSubjectTopic', schema: SpecailSubjectTopicSchema, collection: 'special_subject_topic' },
      { name: 'SpecialSubjectReply', schema: specialSubjectReplySchema, collection: 'reply' },
      { name: 'SpecialSubjectTopicUpvote', schema: SpecialSubjectTopicUpvoteSchema, collection: 'special_subject_topic_upvote' },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: Config.jwtExpireTime },
    }),
    AuthModule,
  ],
  controllers: [UserController, TopicController, ReplyController, TopicTypeController, SysCommonController],
  providers: [UserService, TopicService, ReplyService, TopicTypeService, ToolsService, AuthService, SysCommonService],
  exports: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiAuthMiddleware).
       forRoutes(
         { path: '*/topics', method: RequestMethod.GET },
        );
  }
 }
