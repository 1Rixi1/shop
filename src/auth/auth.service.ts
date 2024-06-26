import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      throw new UnauthorizedException('Пароль не верный');
    }

    if (user && isValidPass) {
      return {
        userId: user.id,
        username: user.username,
        email: user.email,
      };
    }
  }
}
