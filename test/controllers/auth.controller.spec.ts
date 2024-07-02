import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/users/users.model';
import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

describe('Login Controller', () => {
  let app: INestApplication;

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

  it('should login user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    expect(response.body.user.username).toBe(mockedUser.username);
    expect(response.body.user.email).toBe(mockedUser.email);
    expect(response.body.msg).toBe('Logged in');
  });

  it('should login-check user', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/users/login-check')
      .set('Cookie', login.headers['set-cookie']);

    expect(loginCheck.body.username).toBe(mockedUser.username);
    expect(loginCheck.body.email).toBe(mockedUser.email);
  });

  it('should logout', async () => {
    const logout = await request(app.getHttpServer()).get('/users/logout');

    expect(logout.body.msg).toBe('session has ended');
  });
});
