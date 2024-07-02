import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { rootConfig } from 'src/config/rootConfig';
import { AuthModule } from 'src/auth/auth.module';
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';

describe('Boiler-Parts Service', () => {
  let app: INestApplication;

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
      ],
    }).compile();

    app = testModule.createNestApplication();

    boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService);

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

  it('should get part by id', async () => {
    const response = await boilerPartsService.findByOne(1);

    expect(response.dataValues).toEqual(
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
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should get part by bestsellers', async () => {
    const response = await boilerPartsService.findByBestseller();

    response.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should get parts by new', async () => {
    const response = await boilerPartsService.findByNew();

    response.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should get parts by search', async () => {
    const response = await boilerPartsService.findBySearchWord('sa');

    expect(response.rows.length).toBeLessThanOrEqual(20);

    response.rows.forEach((item) => {
      expect(item.name).toContain('sa');

      expect(item.dataValues).toEqual(
        expect.objectContaining({
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should get parts by name', async () => {
    const response = await boilerPartsService.findByName('causa adstringo');

    expect(response.dataValues).toEqual(
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
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });
});
