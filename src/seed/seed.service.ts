import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ProjectsService } from '../projects/projects.service';
import { TaskStatus } from '../tasks/task-status.enum';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

/**
 * Servicio encargado de precargar datos de ejemplo en la base de datos.
 *
 * Se ejecuta una sola vez al arrancar la aplicacion y es idempotente: si ya
 * existen proyectos, no hace nada. Asi, al levantar el servidor por primera
 * vez siempre hay datos con los que probar, pero las tareas/usuarios que se
 * creen o modifiquen luego se conservan entre reinicios.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  /**
   * @param logger Logger de pino asociado a esta clase.
   * @param usersService Servicio de usuarios.
   * @param projectsService Servicio de proyectos.
   * @param tasksService Servicio de tareas.
   */
  constructor(
    @InjectPinoLogger(SeedService.name)
    private readonly logger: PinoLogger,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  /**
   * Hook de NestJS que se dispara cuando la aplicacion termina de arrancar.
   * Llama a la siembra de datos.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.sembrarDatosIniciales();
  }

  /**
   * Crea los datos de ejemplo solo si la base de datos esta vacia.
   */
  private async sembrarDatosIniciales(): Promise<void> {
    const proyectosExistentes = await this.projectsService.findAll();
    if (proyectosExistentes.length > 0) {
      this.logger.info('Ya existen datos, se omite la carga de ejemplos');
      return;
    }

    this.logger.info('Base de datos vacia: cargando datos de ejemplo...');

    // Usuarios responsables
    const ana = await this.usersService.create({
      name: 'Ana Perez',
      email: 'ana.perez@example.com',
    });
    const luis = await this.usersService.create({
      name: 'Luis Rojas',
      email: 'luis.rojas@example.com',
    });
    const maria = await this.usersService.create({
      name: 'Maria Gonzalez',
      email: 'maria.gonzalez@example.com',
    });

    // Proyectos
    const web = await this.projectsService.create({
      name: 'Plataforma Web',
      description: 'Portal de clientes y panel administrativo',
    });
    const movil = await this.projectsService.create({
      name: 'App Movil',
      description: 'Aplicacion para iOS y Android',
    });

    // Tareas de ejemplo con estados y etiquetas variados
    await this.tasksService.create({
      title: 'Disenar el modelo de datos',
      description: 'Definir entidades y relaciones de la base de datos',
      status: TaskStatus.DONE,
      tags: ['backend', 'base-de-datos'],
      projectId: web.id,
      assignedUserId: ana.id,
    });
    await this.tasksService.create({
      title: 'Implementar autenticacion',
      description: 'Login con JWT y refresh tokens',
      status: TaskStatus.IN_PROGRESS,
      tags: ['backend', 'seguridad'],
      projectId: web.id,
      assignedUserId: luis.id,
    });
    await this.tasksService.create({
      title: 'Maquetar pantalla de inicio',
      description: 'Pantalla principal con listado de proyectos',
      status: TaskStatus.TODO,
      tags: ['frontend', 'ui'],
      projectId: web.id,
      assignedUserId: maria.id,
    });
    await this.tasksService.create({
      title: 'Configurar notificaciones push',
      description: 'Integrar Firebase Cloud Messaging',
      status: TaskStatus.BACKLOG,
      tags: ['movil', 'notificaciones'],
      projectId: movil.id,
      assignedUserId: luis.id,
    });
    await this.tasksService.create({
      title: 'Pantalla de perfil de usuario',
      description: 'Ver y editar los datos del usuario',
      status: TaskStatus.TODO,
      tags: ['movil', 'ui'],
      projectId: movil.id,
    });

    this.logger.info('Datos de ejemplo cargados correctamente');
  }
}
