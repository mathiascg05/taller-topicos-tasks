import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { SeedService } from './seed.service';

/**
 * Modulo que se encarga de la precarga de datos de ejemplo. Reutiliza los
 * servicios de usuarios, proyectos y tareas para crear los registros
 * iniciales.
 */
@Module({
  imports: [UsersModule, ProjectsModule, TasksModule],
  providers: [SeedService],
})
export class SeedModule {}
