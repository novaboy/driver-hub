// src/app.module.ts

import { Module } from '@nestjs/common';
import { EntitiesModule } from './entities.module';
import { QRCodeModule } from './qr-code.module';
// import { OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev.local'], // Customize as needed
    }),

    // Configure TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type:
          configService.get<'postgres' | 'mysql' | 'postgres'>('DB_TYPE') ||
          'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'), // Ensure this is a string
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Disable in production
      }),
    }),
    AuthModule,
    QRCodeModule,
    EntitiesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/', // URL prefix
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
