import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './module/admin/admin.module';
import { ApiModule } from './module/api/api.module';
import { FilesModule } from './module/common/file/files.module';
import { MongooseModule } from '@nestjs/mongoose';

import { Config } from './config/config';
import { PublicModule } from './module/common/public/public.module';


@Module({
  imports: [
    PublicModule, AdminModule, ApiModule, FilesModule, 
  ],
  controllers: [AppController],
  providers: [],
  exports: []
})
export class AppModule { }
