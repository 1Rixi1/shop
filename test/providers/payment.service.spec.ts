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
import { PaymentService } from 'src/payment/payment.service';
import { UsersModule } from 'src/users/users.module';

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

describe('Payment Service', () => {
  let app: INestApplication;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),

        ConfigModule.forRoot({ load: [rootConfig] }),
        AuthModule,
        UsersModule,
        PaymentModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

    paymentService = app.get<PaymentService>(PaymentService);

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
    const response = await paymentService.makePayment({ amount: 100 });

    expect(response).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: expect.any(String),
        amount: {
          value: expect.any(String),
          currency: expect.any(String),
        },
        description: expect.any(String),
        recipient: {
          account_id: expect.any(String),
          gateway_id: expect.any(String),
        },
        created_at: expect.any(String),
        confirmation: {
          type: expect.any(String),
          confirmation_url: expect.any(String),
        },
        test: expect.any(Boolean),
        paid: expect.any(Boolean),
        refundable: expect.any(Boolean),
        metadata: expect.any(Object),
      }),
    );
  });
});
