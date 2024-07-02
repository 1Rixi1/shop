import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { AuthModule } from 'src/auth/auth.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { PaymentModule } from 'src/payment/payment.module';
import { Users } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import axios from "axios";

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

const mockedPayment = {
  status: 'pending',
  amount: {
    value: '100.00',
    currency: 'RUB',
  },
};

describe('Payment Controller', () => {
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
        PaymentModule,
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

  it('should make payment', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/payment')
      .send({ amount: 100 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.status).toEqual(mockedPayment.status);
    expect(response.body.amount).toEqual(mockedPayment.amount);
  });
});
