import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogExecutionTime } from '../common/decorators/log-execution-time.decorator';
import { CreateProjectInput } from './dto/create-project.input';
import { Project } from './entities/project.entity';

/**
 * Logica de negocio para la gestion de proyectos.
 */
@Injectable()
export class ProjectsService {
  /**
   * @param projectsRepository Repositorio de TypeORM para la entidad Project.
   */
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  /**
   * Crea y persiste un nuevo proyecto.
   *
   * @param input Datos del proyecto a crear.
   * @returns El proyecto creado.
   */
  @LogExecutionTime()
  create(input: CreateProjectInput): Promise<Project> {
    const proyecto = this.projectsRepository.create(input);
    return this.projectsRepository.save(proyecto);
  }

  /**
   * Devuelve todos los proyectos registrados.
   *
   * @returns Lista de proyectos.
   */
  findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  /**
   * Busca un proyecto por su identificador.
   *
   * @param id Identificador del proyecto.
   * @returns El proyecto encontrado.
   * @throws {NotFoundException} Si no existe un proyecto con ese id.
   */
  async findOne(id: string): Promise<Project> {
    const proyecto = await this.projectsRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new NotFoundException(`No existe el proyecto con id ${id}`);
    }
    return proyecto;
  }
}
