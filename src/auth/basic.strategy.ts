// src/auth/basic.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private configService: ConfigService) {
    super();
  }

  validate(username: string, password: string): any {
    const expectedAuthKey = this.configService.get<string>('AUTH_KEY');

    const receivedAuthKey = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );

    if (receivedAuthKey === expectedAuthKey) {
      return { username };
    }
    return false;
  }
}
