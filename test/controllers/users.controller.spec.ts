import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/users.model';

import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

describe('Users Controller', () => {
  let app: INestApplication;

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

    await app.init();
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

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(createUser);

    const isValidPass = await bcrypt.compare(
      createUser.password,
      response.body.password,
    );

    expect(createUser.username).toBe(response.body.username);
    expect(createUser.email).toBe(response.body.email);
    expect(isValidPass).toBe(true);
  });
});
