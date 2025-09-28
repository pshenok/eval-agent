import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setup as setupSwagger } from './core/swagger/swagger.setup';
import { Logger } from './core/logger/custom.logger.service';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { Config } from './core/config/config';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // CORS
  app.enableCors();
  
  // Swagger
  await setupSwagger(app);
  
  // Get services from the container
  const logger = app.get(Logger);
  const config = app.get(Config);
  
  const port = config.web.port;
  
  await app.listen(port);
  
  logger.info(`Application is running on: http://localhost:${port}`);
  logger.info(`Swagger documentation available at: http://localhost:${port}/docs`);
}

bootstrap();
