import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProjectInput } from './dto/create-project.input';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

/**
 * Resolver GraphQL que expone las operaciones sobre proyectos.
 */
@Resolver(() => Project)
export class ProjectsResolver {
  /**
   * @param projectsService Servicio con la logica de negocio de proyectos.
   */
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Consulta todos los proyectos.
   *
   * @returns Lista de proyectos.
   */
  @Query(() => [Project], {
    name: 'projects',
    description: 'Lista todos los proyectos.',
  })
  findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  /**
   * Consulta un proyecto por su id.
   *
   * @param id Identificador del proyecto.
   * @returns El proyecto encontrado.
   */
  @Query(() => Project, {
    name: 'project',
    description: 'Obtiene un proyecto por su id.',
  })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  /**
   * Crea un nuevo proyecto.
   *
   * @param input Datos del proyecto a crear.
   * @returns El proyecto creado.
   */
  @Mutation(() => Project, { description: 'Crea un nuevo proyecto.' })
  createProject(@Args('input') input: CreateProjectInput): Promise<Project> {
    return this.projectsService.create(input);
  }
}
