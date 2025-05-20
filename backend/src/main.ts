import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './core/web/validation-pipe';
import { createCorsConfig } from './core/web/cors.config';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as bodyParser from 'body-parser';
import { GlobalExceptionHandler } from './core/middleware/exception-handler.middleware';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const i18nService: I18nService<Record<string, unknown>> =
    app.get(I18nService); // <-- Récupérer l'instance I18nService

  app.useStaticAssets(join(__dirname, '..', 'storage'), {
    prefix: '/storage/',
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors(createCorsConfig(configService));
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new GlobalExceptionHandler(i18nService));

  app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(3000);
}

bootstrap()
  .then(() => console.log('Server started and running on port 3000!'))
  .catch(console.error);