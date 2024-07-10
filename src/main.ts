import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  //   {
  //   logger: ['debug', 'warn', 'error', 'log'],

  // }
);
  app.useGlobalPipes(new ValidationPipe()); // global pipe for validations
  await app.listen(3000);
}
bootstrap();
