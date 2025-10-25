import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthGuard } from './auth/guards/auth.guard';
import { EnsureSessionUseCase } from './auth/usecases/ensure-session.usecase';
import { FindOneUserUseCase } from './users/usecases/find-one-user.usecase';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const ensureSessionUseCase = app.get(EnsureSessionUseCase);
  const findOneUserUseCase = app.get(FindOneUserUseCase);
  const reflector = app.get(Reflector);

  const PORT = configService.get<number>('PORT', 8081);
  const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost');

  app.enableCors({
    origin: [clientUrl], // dominio específico, no '*'
    credentials: true, // permite cookies
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.useGlobalGuards(
    new AuthGuard(
      ensureSessionUseCase,
      findOneUserUseCase,
      configService,
      reflector,
    ),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fludge API')
    .setDescription('The Fludge API description')
    .setVersion('1.0')
    .addTag('fludge')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(PORT);
  console.log(`App is ready and listening on port ${PORT} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
