import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { AuthModule } from 'src/auth/auth.module';

import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.model';
import { AuthService } from 'src/auth/auth.service';

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

describe('Auth Service', () => {
  let app: INestApplication;

  let authService: AuthService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),

        ConfigModule.forRoot({ load: [rootConfig] }),
        AuthModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

    authService = testModule.get<AuthService>(AuthService);


    app.use(
      session({ secret: 'myshop', resave: false, saveUninitialized: false }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  beforeEach(async () => {
    const user = new Users();

    const hashedPass = await bcrypt.hash(mockedUser.password, 10);

    user.username = mockedUser.username;
    user.email = mockedUser.email;
    user.password = hashedPass;

    return user.save();
  });

  afterEach(async () => {
    await Users.destroy({ where: { username: mockedUser.username } });
  });

  it('should validate user', async () => {
    const response = await authService.validateUser(
      mockedUser.username,
      mockedUser.password,
    );

    expect(response.username).toBe(mockedUser.username);
    expect(response.email).toBe(mockedUser.email);
    expect(response.userId).toBeDefined()
  });
});
