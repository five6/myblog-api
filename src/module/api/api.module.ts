import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { ComplaintController } from './complaint/complaint.controller';
import { WishController } from './wish/wish.controller';
import { EmotionController } from './emotion/emotion.controller';
import { UnburdenController } from './unburden/unburden.controller';
import { UserService } from '../../service/user/user.service';
import { UnburdenService } from '../../service/unburden/unburden.service';
import { WishService } from '../../service/wish/wish.service';
import { EmotionService } from '../../service/emotion/emotion.service';
import { UserSchema } from '../../schema/user.schema';
import { ComplaintSchema } from '../../schema/complaint.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: "user" },
      { name: 'Unburden', schema: UserSchema, collection: "unburden" },
      { name: 'Wish', schema: UserSchema, collection: "wish" },
      { name: 'Complaint', schema: ComplaintSchema, collection: "role" }
    ])
  ],
  controllers: [UserController, ComplaintController, WishController, EmotionController, UnburdenController],
  providers: [UserService, UnburdenService, WishService, EmotionService],
  exports: [UserService, UnburdenService, WishService, EmotionService]
})
export class ApiModule { }
