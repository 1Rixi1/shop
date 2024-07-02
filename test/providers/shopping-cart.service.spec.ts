import { INestApplication } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { AuthModule } from 'src/auth/auth.module';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { Users } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { where } from 'sequelize';
import { AddToShoppingCartDto } from 'src/shopping-cart/dto/add-to-shopping-cart.dto';

const mockedUser = {
  username: 'Ivan',
  email: 'ivan123@gmai.com',
  password: 'ivan123',
};

describe('Shopping-Cart Service', () => {
  let app: INestApplication;

  let usersService: UsersService;
  let boilerPartsService: BoilerPartsService;

  let shoppingCartService: ShoppingCartService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),

        ConfigModule.forRoot({ load: [rootConfig] }),
        BoilerPartsModule,
        ShoppingCartModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

    usersService = app.get<UsersService>(UsersService);
    boilerPartsService = app.get<BoilerPartsService>(BoilerPartsService);
    shoppingCartService = app.get<ShoppingCartService>(ShoppingCartService);

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
    const user = await usersService.findOne({ username: mockedUser.username });

    const response = await shoppingCartService.findAll(user.id);

    response.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          userId: user.id,
          partId: expect.any(Number),
          boiler_manufacturer: expect.any(String),
          parts_manufacturer: expect.any(String),
          name: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          in_stock: expect.any(Number),
          count: expect.any(Number),
          total_price: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should add item', async () => {
    const user = await usersService.findOne({ username: mockedUser.username });

    await shoppingCartService.addPart({
      username: mockedUser.username,
      partId: 4,
    } as AddToShoppingCartDto);

    const response = await shoppingCartService.findAll(user.id);

    expect(response.find((item) => item.partId === 4)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        partId: 4,
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: expect.any(Number),
        total_price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should update count', async () => {
    const user = await usersService.findOne({ username: mockedUser.username });

    await shoppingCartService.updateCount(3, 1);

    const response = await shoppingCartService.findAll(user.id);

    expect(response.find((item) => item.partId === 1)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        partId: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: 3,
        total_price: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should update total', async () => {
    const user = await usersService.findOne({ username: mockedUser.username });

    const part = await boilerPartsService.findByOne(1);

    await shoppingCartService.updateTotalPrice(part.price * 2000, 1);

    const response = await shoppingCartService.findAll(user.id);

    expect(response.find((item) => item.partId === 1)).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        partId: expect.any(Number),
        boiler_manufacturer: expect.any(String),
        parts_manufacturer: expect.any(String),
        name: expect.any(String),
        image: expect.any(String),
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: expect.any(Number),
        total_price: part.price * 2000,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should delete part', async () => {
    const user = await usersService.findOne({ username: mockedUser.username });

    await shoppingCartService.deleteOne(1);

    const response = await shoppingCartService.findAll(user.id);

    expect(response.find((item) => item.partId === 1)).toBeUndefined();
  });

  it('should delete all parts', async () => {
    const user = await usersService.findOne({ username: mockedUser.username });

    await shoppingCartService.deleteAll(user.id);

    const response = await shoppingCartService.findAll(user.id);

    expect(response).toStrictEqual([])

  });
});
