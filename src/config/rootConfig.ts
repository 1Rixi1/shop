import { registerAs } from '@nestjs/config';
import { sqlConfig } from './sql.config';

export const rootConfig = registerAs('database', () => ({
  sql: {
    ...sqlConfig(),
  },
}));
