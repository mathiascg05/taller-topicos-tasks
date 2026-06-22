import { LogExecutionTime } from './log-execution-time.decorator';

/**
 * Pruebas del decorador @LogExecutionTime. Se comprueba que envuelve el metodo
 * sin alterar su resultado (aspecto transversal transparente).
 */
describe('LogExecutionTime', () => {
  class Ejemplo {
    @LogExecutionTime()
    async sumar(a: number, b: number): Promise<number> {
      return a + b;
    }
  }

  it('devuelve el mismo resultado que el metodo original', async () => {
    const instancia = new Ejemplo();

    const resultado = await instancia.sumar(2, 3);

    expect(resultado).toBe(5);
  });
});
