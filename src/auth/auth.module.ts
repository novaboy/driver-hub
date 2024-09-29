// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthStrategy } from './basic.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [BasicAuthStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
