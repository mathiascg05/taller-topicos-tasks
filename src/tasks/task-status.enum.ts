import { registerEnumType } from '@nestjs/graphql';

/**
 * Estados posibles del ciclo de vida de una tarea dentro de un tablero de
 * trabajo.
 */
export enum TaskStatus {
  /** Tarea registrada pero aun sin planificar. */
  BACKLOG = 'BACKLOG',
  /** Tarea planificada y lista para empezar. */
  TODO = 'TODO',
  /** Tarea en la que se esta trabajando actualmente. */
  IN_PROGRESS = 'IN_PROGRESS',
  /** Tarea terminada. */
  DONE = 'DONE',
}

// Se registra el enum en el esquema GraphQL para poder usarlo como tipo.
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estado actual de una tarea (Backlog, To Do, In Progress, Done).',
});
