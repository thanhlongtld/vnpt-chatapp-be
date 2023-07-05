import { ConfigModule } from '@nestjs/config';
import postgresConfig from './config/postgres';
import { DataSource } from 'typeorm';

ConfigModule.forRoot({
  isGlobal: true,
  load: [postgresConfig],
});

const dataSource = new DataSource(postgresConfig().postgres as any);

export default dataSource;
