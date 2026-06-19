import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable, tap } from 'rxjs';

/**
 * Interceptor que aplica el aspecto transversal de "logging" sobre cada
 * operacion de la API GraphQL.
 *
 * Es un ejemplo de Programacion Orientada a Aspectos (AOP): la logica de
 * registro vive aqui de forma centralizada y se "inyecta" alrededor de cada
 * resolver (un "around advice"), sin ensuciar la logica de negocio de los
 * services. Registra el nombre de la operacion, los argumentos recibidos y el
 * tiempo de ejecucion.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * @param logger Logger de pino asociado a esta clase.
   */
  constructor(
    @InjectPinoLogger(LoggingInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Envuelve la ejecucion del resolver para medir su duracion y dejar el log.
   *
   * @param context Contexto de ejecucion de NestJS.
   * @param next Manejador que continua la cadena de ejecucion.
   * @returns Un Observable con el resultado del resolver.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const operacion = `${info?.parentType?.name}.${info?.fieldName}`;
    const args = gqlContext.getArgs();
    const inicio = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.info(
          { operacion, args, duracionMs: Date.now() - inicio },
          `GraphQL ${operacion} resuelto correctamente`,
        );
      }),
    );
  }
}
