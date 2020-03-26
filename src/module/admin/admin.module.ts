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
import { TopicTypeSchema } from '../../schema/topic-type.schema';
import { ReplySchema } from '../../schema/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'Topic', schema: TopicSchema, collection: 'topic' },
      // { name: 'Topic_type', schema: TopicTypeSchema, collection: 'reply_type' },
      { name: 'Reply', schema: ReplySchema, collection: 'reply' },
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
