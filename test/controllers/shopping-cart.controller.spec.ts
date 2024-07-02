import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { AuthModule } from 'src/auth/auth.module';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';

import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.model';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { UsersService } from 'src/users/users.service';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

describe('Shopping-Cart Controller', () => {
  let app: INestApplication;

  let usersService: UsersService;
  let boilerPartsService: BoilerPartsService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),

        ConfigModule.forRoot({ load: [rootConfig] }),
        AuthModule,
        BoilerPartsModule,
        ShoppingCartModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

    usersService = app.get<UsersService>(UsersService);
    boilerPartsService = app.get<BoilerPartsService>(BoilerPartsService);

    app.use(
      session({
        secret: 'myshop',
        resave: false,
        saveUninitialized: false,
      }),
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

  beforeEach(async () => {
    const cart = new ShoppingCart();

    const user = await usersService.findOne({ username: mockedUser.username });

    const part = await boilerPartsService.findByOne(1);

    cart.userId = user.id;
    cart.partId = part.id;
    cart.boiler_manufacturer = part.boiler_manufacturer;
    cart.parts_manufacturer = part.parts_manufacturer;
    cart.name = part.name;
    cart.image = JSON.parse(part.images)[0];
    cart.price = part.price;
    cart.in_stock = part.in_stock;
    cart.total_price = part.price;

    return cart.save();
  });

  afterEach(async () => {
    await Users.destroy({ where: { username: mockedUser.username } });
    await ShoppingCart.destroy({ where: { partId: 1 } });
  });

  it('should get all parts', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          userId: login.body.user.userId,
          partId: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Number),
          count: expect.any(Number),
          total_price: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('should add part', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ username: login.body.user.username, partId: 5 })
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.partId === 5)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: login.body.user.userId,
        partId: 5,
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: expect.any(Number),
        total_price: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('should update count', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .patch(`/shopping-cart/update-count/1`)
      .send({ count: 3 })
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.partId === 1)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: login.body.user.userId,
        partId: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: 3,
        total_price: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('should update total price', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const part = await boilerPartsService.findByOne(1);

    await request(app.getHttpServer())
      .patch('/shopping-cart/update-total/1')
      .send({ total_price: part.price * 2000 })
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.partId === 1)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: login.body.user.userId,
        partId: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: expect.any(Number),
        total_price: part.price * 2000,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('should delete part', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .delete('/shopping-cart/one/1')
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.partId === 1)).toBeUndefined();
  });

  it('should delete all parts', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .delete(`/shopping-cart/all/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${login.body.user.userId}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toStrictEqual([]);
  });
});
