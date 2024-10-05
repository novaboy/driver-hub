// src/config/database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateEntityDto } from '../dto/create-entity.dto';
import { CreatePanDetailDto } from '../dto/create-pan-detail.dto';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  //entities: [__dirname + '/../**/*.entity.{js,ts}'],
  entities: [CreateEntityDto, CreatePanDetailDto],
  synchronize: true, // Set to false in production and use migrations
});
