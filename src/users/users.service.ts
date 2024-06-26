import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './users.model';
import { CreateUserDto } from './dto/createUserDto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private readonly usersModel: typeof Users) {}

  async findOne(filter: {
    username?: string;
    email?: string;
    id?: string;
  }): Promise<Users> {
    return this.usersModel.findOne({ where: { ...filter } });
  }

  async createOne(
    createUserDto: CreateUserDto,
  ): Promise<Users | { errormessage: string }> {
    const user = new Users();

    const isExistedUserByName = await this.findOne({
      username: createUserDto.username,
    });

    const isExistedUserByEmail = await this.findOne({
      email: createUserDto.email,
    });

    if (isExistedUserByName) {
      return { errormessage: 'Такое имя уже существует' };
    }

    if (isExistedUserByEmail) {
      return { errormessage: 'Такой email уже существует' };
    }

    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = hashedPass;

    return user.save();
  }
}
