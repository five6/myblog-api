import { RedisModule} from 'nestjs-redis';
import { Module } from '@nestjs/common';
import { Config } from '../../../config/config';

@Module({
    imports:[
        RedisModule.register(Config.redisOptions)
    ],
    providers: [],
    exports:[]
})
export class PublicModule {}
 