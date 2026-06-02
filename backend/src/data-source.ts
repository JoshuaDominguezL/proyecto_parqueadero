import 'reflect-metadata';
import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

const requiredEnv = (key: string) => {
  const value = process.env[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: requiredEnv('DB_HOST'),
  port: parseInt(requiredEnv('DB_PORT'), 10),
  username: requiredEnv('DB_USERNAME'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_NAME'),
  entities: [path.join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/migrations/*{.ts,.js}')],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false,
  migrationsTableName: 'migrations_history',
  namingStrategy: new SnakeNamingStrategy(),
});
