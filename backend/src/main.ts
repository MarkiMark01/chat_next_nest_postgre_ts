import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ALLOWED_ORIGINS } from './cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Перевіряє тіло запитів за DTO. whitelist прибирає зайві поля (наприклад, role)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Раніше origin.includes('localhost') пропускав і http://localhost.evil.com
  app.enableCors({
    origin: ALLOWED_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();

