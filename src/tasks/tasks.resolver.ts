import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

/**
 * Resolver GraphQL que expone el CRUD de tareas.
 */
@Resolver(() => Task)
export class TasksResolver {
  /**
   * @param tasksService Servicio con la logica de negocio de tareas.
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Consulta todas las tareas.
   *
   * @returns Lista de tareas.
   */
  @Query(() => [Task], { name: 'tasks', description: 'Lista todas las tareas.' })
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  /**
   * Consulta una tarea por su id.
   *
   * @param id Identificador de la tarea.
   * @returns La tarea encontrada.
   */
  @Query(() => Task, { name: 'task', description: 'Obtiene una tarea por su id.' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  /**
   * Crea una nueva tarea.
   *
   * @param input Datos de la tarea a crear.
   * @returns La tarea creada.
   */
  @Mutation(() => Task, { description: 'Crea una nueva tarea.' })
  createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.tasksService.create(input);
  }

  /**
   * Actualiza una tarea existente (estatus, etiquetas, responsable, etc.).
   *
   * @param id Identificador de la tarea a actualizar.
   * @param input Campos a modificar.
   * @returns La tarea actualizada.
   */
  @Mutation(() => Task, { description: 'Actualiza una tarea existente.' })
  updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTaskInput,
  ): Promise<Task> {
    return this.tasksService.update(id, input);
  }

  /**
   * Elimina una tarea.
   *
   * @param id Identificador de la tarea a eliminar.
   * @returns true si se elimino correctamente.
   */
  @Mutation(() => Boolean, { description: 'Elimina una tarea por su id.' })
  deleteTask(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.tasksService.remove(id);
  }
}
