import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

/**
 * Punto de entrada de la aplicacion. Crea la instancia de NestJS, conecta el
 * logger de pino, activa la validacion global de inputs y levanta el servidor.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Se usa el logger de pino como logger oficial de la aplicacion.
  app.useLogger(app.get(Logger));

  // Validacion automatica de todos los inputs GraphQL (aspecto transversal).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
