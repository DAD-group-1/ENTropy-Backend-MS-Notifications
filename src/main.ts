import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from '@dad-group-1/backend-common';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger('notifications-service', 'info'),
  });
  const configService = app.get(ConfigService);

  const microserviceHost = configService.get<string>('HOST', '0.0.0.0');
  const microservicePort = configService.get<number>('PORT', 3010);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  await app.startAllMicroservices();
  await app.init(); // Initialize the app without starting the HTTP server

  new Logger('Bootstrap').log(
    `User microservice started on ${microserviceHost}:${microservicePort}`,
  );
}
bootstrap();
