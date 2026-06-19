import { Logger } from '@nestjs/common';

/**
 * Decorador de metodo que mide y registra cuanto tarda en ejecutarse el
 * metodo decorado.
 *
 * Es un ejemplo de AOP "hecho a mano": el aspecto (medir tiempo) se separa de
 * la logica del metodo y se aplica simplemente anteponiendo @LogExecutionTime()
 * sobre cualquier metodo de un service. Funciona tanto con metodos sincronos
 * como asincronos.
 *
 * @returns El decorador de metodo.
 */
export function LogExecutionTime(): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const metodoOriginal = descriptor.value;
    const logger = new Logger(target.constructor.name);

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const inicio = Date.now();
      try {
        return await metodoOriginal.apply(this, args);
      } finally {
        logger.debug(
          `${String(propertyKey)}() tardo ${Date.now() - inicio}ms`,
        );
      }
    };

    return descriptor;
  };
}
