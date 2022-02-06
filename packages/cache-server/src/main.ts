import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  let app;
  let protocol = 'http';

  if (process.env.PRIVATE_KEY && process.env.PUBLIC_CERTIFICATE) {
    app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: process.env.PRIVATE_KEY,
        cert: process.env.PUBLIC_CERTIFICATE,
      },
    });
    protocol = 'https';
  } else {
    app = await NestFactory.create(AppModule);
  }

  const port = process.env.PORT || 3333;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: ${protocol}://localhost:${port}`);
}

bootstrap();
