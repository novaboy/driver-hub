// src/auth/auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly expectedAuthKey: string;

  constructor() {
    const authKey = process.env.AUTH_KEY;
    if (!authKey) {
      throw new Error('AUTH_KEY is not set in environment variables');
    }
    this.expectedAuthKey = Buffer.from(authKey).toString('base64');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [authType, authKey] = authHeader.split(' ');

    if (authType !== 'Basic' || authKey !== this.expectedAuthKey) {
      throw new UnauthorizedException('Invalid Authentication credentials');
    }

    return true;
  }
}
