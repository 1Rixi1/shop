import { registerAs } from '@nestjs/config';
import { Dialect } from 'sequelize';
import * as process from 'process';

export const sqlConfig = registerAs('database', () => ({
  dialect: <Dialect>process.env.SQL_DIALECT || 'mysql',
  logging: process.env.SQL_LOGGING === 'true',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: true,
}));
