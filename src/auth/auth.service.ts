import { UserService } from 'src/user/user.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, password) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('No user matching this email');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    delete user.password;

    const payload = {
      username: user.email,
      sub: user.id,
    };
    return {
      token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
