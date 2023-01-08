import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from '@circle/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/exceptions/http.exception';

let port = 80;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.kafka.brokers,
        clientId: 'WALLET_CLIENT',
      },
    },
  });

  // global pipes for request validation
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: false,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
      validationError: { value: false },
      transform: true,
    }),
  );
  // enable cors
  app.enableCors({ origin: true });
  // bind port to env variable
  port = config.port || port;

  // setup swagger docs
  const swagConfig = new DocumentBuilder()
    .setTitle('circle Wallet Service')
    .setDescription('Wallet API Documentation for circle')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Autorization',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();

  SwaggerModule.setup(
    '/docs',
    app,
    SwaggerModule.createDocument(app, swagConfig),
  );

  await app.listen(port);
  // app.startAllMicroservices();
}

bootstrap().then(() => {
  console.info(`
      ------------
      Server Application Started!
      API V1: http://localhost:${port}/
      API Docs: http://localhost:${port}/docs
      Microserservice Started Successfully
      ------------
`);
});
