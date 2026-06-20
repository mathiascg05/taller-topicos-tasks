import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * Resolver GraphQL que expone las operaciones sobre usuarios.
 */
@Resolver(() => User)
export class UsersResolver {
  /**
   * @param usersService Servicio con la logica de negocio de usuarios.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Consulta todos los usuarios.
   *
   * @returns Lista de usuarios.
   */
  @Query(() => [User], { name: 'users', description: 'Lista todos los usuarios.' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Consulta un usuario por su id.
   *
   * @param id Identificador del usuario.
   * @returns El usuario encontrado.
   */
  @Query(() => User, { name: 'user', description: 'Obtiene un usuario por su id.' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Crea un nuevo usuario.
   *
   * @param input Datos del usuario a crear.
   * @returns El usuario creado.
   */
  @Mutation(() => User, { description: 'Crea un nuevo usuario.' })
  createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.create(input);
  }
}
