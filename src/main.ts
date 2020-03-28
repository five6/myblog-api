import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Config } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态资源目录
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  // 配置模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  // 配置cookie中间件
  app.use(cookieParser('this signed cookies'));

  // 管理后台和前台api地址前缀
  app.setGlobalPrefix(Config.api_prefix);

  // 配置全局错误filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置session的中间件
  app.use(session({
    secret: 'keyboard cat',
    resave: true, // 每次请求都重新设置session cookie
    saveUninitialized: true, // 无论有没有session cookie，每次请求都设置个session cookie
    cookie: { maxAge: 1000 * 60 * 30, httpOnly: true },
    rolling: true,
  }));


  const options = new DocumentBuilder()
    .setTitle('56网站后台接口')
    .setDescription('56网站后台接口描述')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(7000);
}
bootstrap();
