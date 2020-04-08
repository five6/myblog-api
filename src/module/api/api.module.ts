import { Module, LoggerService } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'Topic', schema: UserSchema, collection: 'topic' },
      { name: 'SysCommon', schema: SysCommonSchema, collection: 'sys-common' },
      { name: 'Reply', schema: UserSchema, collection: 'reply' },
      { name: 'Upvote', schema: UpvoteSchema, collection: 'upvote' },
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
export class ApiModule { }
