import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../service/user/user.service';

@Injectable()
export class ApiAuthMiddleware implements NestMiddleware<Request|any, Response> {
  constructor(private readonly userService: UserService) {}
  async use(req: Request|any, res: Response, next: Function) {
    
    const token = req.header('authorization');
    if(!token) {
      next();
      return;
    }
    const user = await this.userService.getUserByToken(token);
    if(!user) {
      next();
      return;
    }
    req.user = user;
    next();
  }
}