import { RedisModule} from 'nestjs-redis';
import { Module } from '@nestjs/common';
import { Config } from '../../../config/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports:[
        RedisModule.register(Config.redisOptions),
        MongooseModule.forRoot(Config.mongo_db, { useNewUrlParser: true, useUnifiedTopology: true })
    ],
    providers: [],
    exports:[]
})
export class PublicModule {}
 