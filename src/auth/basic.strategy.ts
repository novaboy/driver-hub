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

    console.log('AUTH_KEY (basic.strategy.ts):', expectedAuthKey);

    const receivedAuthKey = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );

    console.log('receivedAuthKey (basic.strategy.ts):', receivedAuthKey);

    if (receivedAuthKey === expectedAuthKey) {
      console.debug('expectedAuthKey and receivedAuthKey matching');
      return { username };
    }
    return false;
  }
}
