import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { METHODS } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors()

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
