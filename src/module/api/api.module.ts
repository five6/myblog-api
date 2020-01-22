import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { ComplaintController } from './complaint/complaint.controller';
import { WishController } from './wish/wish.controller';
import { EmotionController } from './emotion/emotion.controller';
import { UnburdenController } from './unburden/unburden.controller';
@Module({
  imports: [],
  controllers: [UserController, ComplaintController, WishController, EmotionController, UnburdenController]
})
export class ApiModule { }
