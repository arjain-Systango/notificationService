import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import envVars from '../../resources/config';
const configSeed: DataSourceOptions = {
  type: 'postgres',
  host: envVars.database.host,
  port: Number(envVars.database.port),
  username: envVars.database.user,
  password: envVars.database.password,
  database: envVars.database.name,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, '../entities/*.entity.{js,ts}')],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscriber/*.{ts,js}')],
  namingStrategy: new SnakeNamingStrategy(),
};

export = configSeed;
