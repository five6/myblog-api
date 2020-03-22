import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './module/admin/admin.module';
import { ApiModule } from './module/api/api.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AdminModule, ApiModule, MongooseModule.forRoot('mongodb://localhost/mylog', { useNewUrlParser: true, useUnifiedTopology: true })],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
