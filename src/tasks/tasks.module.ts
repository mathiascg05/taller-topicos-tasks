import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

/**
 * Modulo que agrupa todo lo relacionado con la gestion de tareas. Importa los
 * modulos de usuarios y proyectos para poder asignar responsables y asociar
 * cada tarea a su proyecto.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, ProjectsModule],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
