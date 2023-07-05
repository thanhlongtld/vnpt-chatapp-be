import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const appConfig = configService.get('app');
  const corsConfig = configService.get('cors');

  app.enableCors({
    origin:
      appConfig.env !== 'local'
        ? (origin, callback) => {
            if (corsConfig.whitelist.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS!'));
            }
          }
        : true,
  });

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(appConfig.port);
}
bootstrap();
