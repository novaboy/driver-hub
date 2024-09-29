// src/app.module.ts

import { Module } from '@nestjs/common';
// import { OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { DriversModule } from './drivers/drivers.module';
import { CreateDriverDto } from './drivers/dto/create-driver.dto';
import { CreatePanDetailDto } from './drivers/dto/create-pan-detail.dto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev.local'], // Customize as needed
    }),
    TypeOrmModule.forFeature([CreateDriverDto, CreatePanDetailDto]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      //useFactory: typeOrmConfig,
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'), // Ensure this is a string
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Disable in production
      }),
    }),
    DriversModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
