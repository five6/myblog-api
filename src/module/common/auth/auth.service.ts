import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UserService } from '../../../service/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(user: any) {
    const payload = {
      id: user._id, 
      username: user.username, 
      email: user.email,
      // 返回客户端
      nickName: user.nickName, 
      avatarUrl: user.avatarUrl,
      registerTime: user.registerTime, 
      useDefaultAvatarUrl: user.useDefaultAvatarUrl
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signout() {
    
  }
}
