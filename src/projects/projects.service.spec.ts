import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

/**
 * Pruebas unitarias del servicio de proyectos con el repositorio mockeado.
 */
describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: jest.Mocked<Repository<Project>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            create: jest.fn((data) => data),
            save: jest.fn((data) => Promise.resolve({ id: 'proj-1', ...data })),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProjectsService);
    repository = module.get(getRepositoryToken(Project));
  });

  it('crea y persiste un proyecto', async () => {
    const resultado = await service.create({
      name: 'Plataforma Web',
      description: 'Portal',
    });

    expect(repository.save).toHaveBeenCalled();
    expect(resultado.id).toBe('proj-1');
  });

  it('lanza NotFoundException si el proyecto no existe', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });
});
