import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './module/common/auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
