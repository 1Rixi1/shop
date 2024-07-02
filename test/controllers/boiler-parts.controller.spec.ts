import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { UsersModule } from 'src/users/users.module';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';

import * as session from 'express-session';
import * as passport from 'passport';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

describe('Boiler-Parts Controller', () => {
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
        BoilerPartsModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

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

  afterEach(async () => {
    await Users.destroy({ where: { username: mockedUser.username } });
  });

  it('should get one part', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/boiler-parts/find/1')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        vendor_code: expect.any(String),
        images: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        popularity: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        compatibility: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('should get bestsellers parts', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/boiler-parts/bestsellers')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.rows).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          vendor_code: expect.any(String),
          images: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Number),
          popularity: expect.any(Number),
          bestseller: true,
          new: expect.any(Boolean),
          compatibility: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('should get new parts', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .get('/boiler-parts/new')
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.rows).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          vendor_code: expect.any(String),
          images: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Number),
          popularity: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: true,
          compatibility: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('should get parts by search', async () => {
    const body = { search: 'sa' };

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/boiler-parts/search')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.rows.length).toBeLessThanOrEqual(20);

    response.body.rows.forEach((el) => {
      expect(el.name.toLowerCase()).toContain(body.search);
    });

    expect(response.body.rows).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          vendor_code: expect.any(String),
          images: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Number),
          popularity: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: expect.any(Boolean),
          compatibility: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]),
    );
  });

  it('should get parts by name', async () => {
    const body = { name: 'causa adstringo' };

    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/boiler-parts/name')
      .send(body)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: 'causa adstringo',
        description: expect.any(String),
        vendor_code: expect.any(String),
        images: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        popularity: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        compatibility: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });



});
