import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { RequestLoggerMiddleware } from './common/logger/request-logger.middleware';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://snip-seven.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  const requestLogger = new RequestLoggerMiddleware(logger);
  app.use(requestLogger.use.bind(requestLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const port = process.env.PORT || 5005;
  console.log("server started", process.env.PORT)

  await app.listen(port);
  console.log("server started")

  logger.log(
    `Application running on http://localhost:${port}`,
    'Application',
  );

  async function gracefulShutdown(signal: string): Promise<void> {
    logger.log(`Received ${signal}`, 'Application');
    try {
      const connection = app.get<Connection>(getConnectionToken());
      if (connection) {
        await connection.close();
      }
      await app.close();
      process.exit(0);
    } catch (error) {
      logger.error(
        `Shutdown error`,
        error instanceof Error ? error.message : String(error),
        'Application',
      );
      process.exit(1);
    }
  }

  ['SIGINT', 'SIGTERM'].forEach((signal) =>
    process.on(signal, () => gracefulShutdown(signal)),
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error.message, 'Application');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(
      'Unhandled Rejection',
      reason instanceof Error ? reason.message : String(reason),
      'Application',
    );
    process.exit(1);
  });
}

bootstrap();
