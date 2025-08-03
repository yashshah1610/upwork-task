import { DataSource } from 'typeorm';
import { Resource } from './entity/Resource';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  logging: false,
  entities: [Resource],
});
