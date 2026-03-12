import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields from request body
      forbidNonWhitelisted: true, // throw if unknown fields are sent
      transform: true,       // auto-convert types (e.g. string "3000" → number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
