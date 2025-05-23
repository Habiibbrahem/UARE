import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata'; // Ensure this import is at the top of the file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // allow your frontend origin
  });

  await app.listen(3000);
}

bootstrap();