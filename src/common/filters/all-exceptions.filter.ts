import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * Filtro de excepciones global para la API GraphQL.
 *
 * Es otro aspecto transversal (AOP): centraliza el manejo de errores de toda
 * la aplicacion. En vez de poner try/catch repetidos en cada resolver, este
 * filtro captura cualquier excepcion, la registra en el log y devuelve un
 * error de GraphQL con un mensaje uniforme para el cliente.
 */
@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  /**
   * @param logger Logger de pino asociado a esta clase.
   */
  constructor(
    @InjectPinoLogger(AllExceptionsFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Captura la excepcion, la registra y la transforma en un error de GraphQL.
   *
   * @param exception Excepcion lanzada en algun punto de la aplicacion.
   * @param host Contexto de argumentos de NestJS.
   * @returns El error que finalmente recibira el cliente GraphQL.
   */
  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const mensaje =
      exception instanceof Error ? exception.message : 'Error interno del servidor';

    this.logger.error(
      { operacion: info?.fieldName, error: mensaje },
      'Ocurrio un error resolviendo la operacion GraphQL',
    );

    // Las excepciones HTTP conocidas (ej. NotFoundException) ya traen un
    // mensaje claro, asi que lo reutilizamos. El resto se enmascara.
    if (exception instanceof HttpException) {
      return new GraphQLError(mensaje, {
        extensions: { code: exception.getStatus() },
      });
    }

    return new GraphQLError('Error interno del servidor', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
}
