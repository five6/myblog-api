import { Module, LoggerService } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../service/auth/constants';
import { PassportModule } from '@nestjs/passport';


import { UserController } from './user/user.controller';
import { TopicController } from './topic/topic.controller';
import { ReplyController } from './reply/reply.controller';
import { TopicTypeController } from './topic-type/topic-type.controller';

import { UserService } from '../../service/user/user.service';
import { TopicService } from '../../service/topic/topic.service';
import { ReplyService } from '../../service/reply/reply.service';
import { TopicTypeService } from '../../service/topic-type/topic-type.service';
import { ToolsService } from '../../service/tools/tools.service';

import { UserSchema } from '../../schema/user.schema';
import { AuthService } from '../../service/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'topic', schema: UserSchema, collection: 'topic' },
      { name: 'topic_type', schema: UserSchema, collection: 'reply_type' },
      { name: 'reply', schema: UserSchema, collection: 'reply' },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [UserController, TopicController, ReplyController, TopicTypeController],
  providers: [UserService, TopicService, ReplyService, TopicTypeService, ToolsService, AuthService],
  exports: [UserService, TopicService, ReplyService],
})
export class ApiModule { }
