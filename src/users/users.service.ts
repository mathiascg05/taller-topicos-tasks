import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogExecutionTime } from '../common/decorators/log-execution-time.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

/**
 * Logica de negocio para la gestion de usuarios.
 */
@Injectable()
export class UsersService {
  /**
   * @param usersRepository Repositorio de TypeORM para la entidad User.
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Crea y persiste un nuevo usuario.
   *
   * @param input Datos del usuario a crear.
   * @returns El usuario creado.
   */
  @LogExecutionTime()
  create(input: CreateUserInput): Promise<User> {
    const usuario = this.usersRepository.create(input);
    return this.usersRepository.save(usuario);
  }

  /**
   * Devuelve todos los usuarios registrados.
   *
   * @returns Lista de usuarios.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Busca un usuario por su identificador.
   *
   * @param id Identificador del usuario.
   * @returns El usuario encontrado.
   * @throws {NotFoundException} Si no existe un usuario con ese id.
   */
  async findOne(id: string): Promise<User> {
    const usuario = await this.usersRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`No existe el usuario con id ${id}`);
    }
    return usuario;
  }
}
