import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * Pruebas unitarias del servicio de usuarios con el repositorio mockeado.
 */
describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn((data) => data),
            save: jest.fn((data) => Promise.resolve({ id: 'user-1', ...data })),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('crea y persiste un usuario', async () => {
    const resultado = await service.create({
      name: 'Ana',
      email: 'ana@test.com',
    });

    expect(repository.save).toHaveBeenCalled();
    expect(resultado).toEqual({ id: 'user-1', name: 'Ana', email: 'ana@test.com' });
  });

  it('lanza NotFoundException si el usuario no existe', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });
});
