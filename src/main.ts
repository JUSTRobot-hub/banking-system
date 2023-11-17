import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as express from 'express';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as requestIp from 'request-ip';
import * as responseTime from 'response-time';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilterDevelopment } from './errors/developmentFilters.errors';
import { AllExceptionsFilterProduction } from './errors/productionFilters.errors';

async function DevelopmentMode(app: INestApplication) {
  console.log('Development mode');
  app.use(responseTime());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Banking System Apis')
    .setDescription('The Main Api Documentation for Banking System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api-docs', app, document);
  app.useGlobalFilters(new AllExceptionsFilterDevelopment());
}

async function ProductionMode(app: INestApplication) {
  console.log('Production mode');
  const whitelist = [];
  app.use(helmet({ hidePoweredBy: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '200mb' }));
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, origin);
      } else callback(new Error('Not allowed by CORS'));
    },

    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilterProduction());
}

async function bootstrap() {
  const instance = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),

    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
      }),
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  app.use(requestIp.mw());
  app.use(morgan(':method :url :status :response-time ms - :date[web]'));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  process.env.NODE_ENV == 'Development'
    ? await DevelopmentMode(app)
    : await ProductionMode(app);

  await app.listen(process.env.PORT);
}
bootstrap();
