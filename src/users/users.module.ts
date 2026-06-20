import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

/**
 * Modulo que agrupa todo lo relacionado con la gestion de usuarios.
 * Exporta UsersService para que el modulo de tareas pueda asignar
 * responsables.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
