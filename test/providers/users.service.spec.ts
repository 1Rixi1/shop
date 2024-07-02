import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.model';

import * as bcrypt from 'bcrypt';

describe('User Controller', () => {
  let app: INestApplication;

  let usersService: UsersService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),

        ConfigModule.forRoot({ load: [rootConfig] }),

        UsersModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

    usersService = testModule.get<UsersService>(UsersService);

    await testModule.init();
  });

  afterEach(async () => {
    await Users.destroy({ where: { username: 'Ivan' } });
  });

  it('should create user', async () => {
    const createUser = {
      username: 'Ivan',
      email: 'ivan123@gmail.com',
      password: 'ivan123',
    };

    const response = (await usersService.createOne(createUser)) as Users;

    const isValidPass = await bcrypt.compare(
      createUser.password,
      response.password,
    );

    expect(createUser.username).toBe(response.username);
    expect(createUser.email).toBe(response.email);
    expect(isValidPass).toBe(true);
  });
});
