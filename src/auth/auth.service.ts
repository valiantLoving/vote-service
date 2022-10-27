import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRes } from 'src/modules/users/interfaces';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证用户username和password
   * 注意：从客户端传过来的请求body中的字段名称必须是username和password，否则该策略解析不出来
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByName(username, true);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 登录获取访问令牌
  async login(user: IUserRes) {
    const payload = {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }
}
