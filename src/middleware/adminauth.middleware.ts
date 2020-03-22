import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class AdminauthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    var pathname = req.baseUrl;  //获取访问的地址
    var userinfo = req.session.userinfo;
    if(userinfo && userinfo.username) {
      next();
    } else {
      // if(_.endsWith(pathname, 'admin/login') || _.endsWith(pathname, 'admin/login')) {
      //   next();
      // } else {
      //   res.send({
      //     code: -1,
      //     message: '验证失败'
      //   });
      // }
      throw new UnauthorizedException();
    }
  }
}
