import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

/**
 * Modulo que agrupa todo lo relacionado con la gestion de proyectos.
 * Exporta ProjectsService para que el modulo de tareas pueda asociar cada
 * tarea a su proyecto.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
