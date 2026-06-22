import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

/**
 * Pruebas unitarias del servicio de tareas. El repositorio de TypeORM y los
 * servicios de los que depende se reemplazan por mocks para aislar la logica.
 */
describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: jest.Mocked<Repository<Task>>;
  let projectsService: { findOne: jest.Mock };
  let usersService: { findOne: jest.Mock };

  const proyectoFalso = { id: 'proj-1', name: 'Proyecto', description: null };
  const usuarioFalso = { id: 'user-1', name: 'Ana', email: 'ana@test.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            // create devuelve el mismo objeto que recibe para poder inspeccionarlo
            create: jest.fn((data) => data),
            save: jest.fn((data) => Promise.resolve({ id: 'task-1', ...data })),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: ProjectsService, useValue: { findOne: jest.fn() } },
        { provide: UsersService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get(TasksService);
    tasksRepository = module.get(getRepositoryToken(Task));
    projectsService = module.get(ProjectsService);
    usersService = module.get(UsersService);
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('asigna BACKLOG y tags vacios por defecto cuando no se indican', async () => {
      projectsService.findOne.mockResolvedValue(proyectoFalso);

      const resultado = await service.create({
        title: 'Tarea',
        description: 'desc',
        projectId: 'proj-1',
      } as any);

      expect(projectsService.findOne).toHaveBeenCalledWith('proj-1');
      expect(tasksRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: TaskStatus.BACKLOG, tags: [] }),
      );
      expect(resultado.id).toBe('task-1');
    });

    it('asigna el usuario responsable cuando llega assignedUserId', async () => {
      projectsService.findOne.mockResolvedValue(proyectoFalso);
      usersService.findOne.mockResolvedValue(usuarioFalso);

      await service.create({
        title: 'Tarea',
        description: 'desc',
        projectId: 'proj-1',
        assignedUserId: 'user-1',
      } as any);

      expect(usersService.findOne).toHaveBeenCalledWith('user-1');
      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ assignedUser: usuarioFalso }),
      );
    });
  });

  describe('findOne', () => {
    it('lanza NotFoundException si la tarea no existe', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('elimina la tarea y devuelve true', async () => {
      const tarea = { id: 'task-1', title: 'Tarea' } as Task;
      tasksRepository.findOne.mockResolvedValue(tarea);

      const resultado = await service.remove('task-1');

      expect(tasksRepository.remove).toHaveBeenCalledWith(tarea);
      expect(resultado).toBe(true);
    });
  });
});
