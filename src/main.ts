import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Access the ConfigService
  const configService = app.get(ConfigService);

  // **⚠️ Warning:** Avoid logging sensitive information in production environments.
  console.log('--- Environment Variables ---');
  console.log('DATABASE_HOST:', configService.get<string>('DATABASE_HOST'));
  console.log('DATABASE_PORT:', configService.get<string>('DATABASE_PORT'));
  console.log('DATABASE_USER:', configService.get<string>('DATABASE_USER'));

  const dbPassword = configService.get<string>('DATABASE_PASSWORD');
  const maskedPassword = dbPassword
    ? dbPassword.length > 2
      ? dbPassword[0] +
        '*'.repeat(dbPassword.length - 2) +
        dbPassword[dbPassword.length - 1]
      : '*'.repeat(dbPassword.length)
    : 'undefined';
  console.log('DATABASE_PASSWORD:', maskedPassword);

  console.log('DATABASE_NAME:', configService.get<string>('DATABASE_NAME'));
  console.log('------------------------------');

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
