import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { SecretManagerConfig } from '../../resources/config/secretManager.config';

async function getConfig() {
  let secret = await SecretManagerConfig.secret;

  if (!secret) {
    secret = await SecretManagerConfig.getSecretManagerValue();
  }

  return {
    type: 'postgres',
    name: 'default',
    host: secret?.NS_DB_HOST,
    port: secret?.NS_DB_PORT,
    username: secret?.NS_DB_USER,
    password: secret?.NS_DB_PASSWORD,
    database: secret?.NS_DB_NAME,
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, '../entities/*.entity.{js,ts}')],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    subscribers: [path.join(__dirname, '../subscriber/*.{ts,js}')],
    namingStrategy: new SnakeNamingStrategy(),
  } as DataSourceOptions;
}

export = getConfig;
