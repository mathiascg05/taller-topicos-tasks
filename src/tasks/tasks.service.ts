import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogExecutionTime } from '../common/decorators/log-execution-time.decorator';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

/**
 * Logica de negocio para la gestion de tareas: creacion, consulta,
 * actualizacion y eliminacion.
 */
@Injectable()
export class TasksService {
  /**
   * @param tasksRepository Repositorio de TypeORM para la entidad Task.
   * @param projectsService Servicio de proyectos, para resolver el proyecto
   *   asociado a una tarea.
   * @param usersService Servicio de usuarios, para resolver el responsable de
   *   una tarea.
   */
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Crea una tarea nueva, asociandola a su proyecto y, opcionalmente, a un
   * usuario responsable.
   *
   * @param input Datos de la tarea a crear.
   * @returns La tarea creada.
   */
  @LogExecutionTime()
  async create(input: CreateTaskInput): Promise<Task> {
    const project = await this.projectsService.findOne(input.projectId);

    const task = this.tasksRepository.create({
      title: input.title,
      description: input.description,
      status: input.status ?? TaskStatus.BACKLOG,
      tags: input.tags ?? [],
      project,
    });

    if (input.assignedUserId) {
      task.assignedUser = await this.usersService.findOne(input.assignedUserId);
    }

    return this.tasksRepository.save(task);
  }

  /**
   * Devuelve todas las tareas.
   *
   * @returns Lista de tareas.
   */
  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  /**
   * Busca una tarea por su identificador.
   *
   * @param id Identificador de la tarea.
   * @returns La tarea encontrada.
   * @throws {NotFoundException} Si no existe una tarea con ese id.
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`No existe la tarea con id ${id}`);
    }
    return task;
  }

  /**
   * Actualiza los campos indicados de una tarea (estatus, etiquetas, usuario
   * responsable, etc.). Solo se modifican los campos presentes en el input.
   *
   * @param id Identificador de la tarea a actualizar.
   * @param input Campos a modificar.
   * @returns La tarea ya actualizada.
   */
  @LogExecutionTime()
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const task = await this.findOne(id);

    if (input.title !== undefined) {
      task.title = input.title;
    }
    if (input.description !== undefined) {
      task.description = input.description;
    }
    if (input.status !== undefined) {
      task.status = input.status;
    }
    if (input.tags !== undefined) {
      task.tags = input.tags;
    }
    if (input.projectId !== undefined) {
      task.project = await this.projectsService.findOne(input.projectId);
    }
    if (input.assignedUserId !== undefined) {
      task.assignedUser = await this.usersService.findOne(input.assignedUserId);
    }

    return this.tasksRepository.save(task);
  }

  /**
   * Elimina una tarea por su identificador.
   *
   * @param id Identificador de la tarea a eliminar.
   * @returns true si la tarea se elimino correctamente.
   * @throws {NotFoundException} Si no existe una tarea con ese id.
   */
  @LogExecutionTime()
  async remove(id: string): Promise<boolean> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
    return true;
  }
}
