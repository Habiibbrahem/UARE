import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata'; // Ensure this import is at the top of the file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);


}
bootstrap();