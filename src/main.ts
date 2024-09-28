import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // This adds 'api' as a prefix to all routes
  await app.listen(3000);
}
bootstrap();
