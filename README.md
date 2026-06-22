# Sistema de Gestión de Tareas — API GraphQL

Servidor desarrollado con **NestJS** que expone una **API GraphQL** para gestionar tareas de proyectos de desarrollo de software. Permite crear, consultar, editar y eliminar tareas, además de gestionar los usuarios responsables y los proyectos a los que pertenecen.

Taller de la materia **Tópicos de Programación**. Temas aplicados: **Programación Orientada a Aspectos (AOP)**, **GitFlow** y **Clean Code**.

## Tecnologías

- [NestJS](https://nestjs.com/) (TypeScript)
- [GraphQL](https://graphql.org/) con Apollo (enfoque _code-first_)
- [TypeORM](https://typeorm.io/) + **SQLite** como base de datos
- [pino](https://getpino.io/) (`nestjs-pino`) para logs estructurados
- `class-validator` para la validación de inputs

## Modelo de datos

Cada **tarea** (`Task`) contiene como mínimo:

| Campo          | Descripción                                      |
| -------------- | ------------------------------------------------ |
| `id`           | Identificador único (UUID)                       |
| `title`        | Título                                           |
| `description`  | Descripción                                      |
| `status`       | Estado: `BACKLOG`, `TODO`, `IN_PROGRESS`, `DONE` |
| `tags`         | Arreglo dinámico de etiquetas (strings)          |
| `createdAt`    | Fecha de creación (automática)                   |
| `assignedUser` | Usuario responsable (opcional)                   |
| `project`      | Proyecto al que pertenece la tarea               |

También se modelan las entidades `User` y `Project`, necesarias para asignar responsables y agrupar las tareas por proyecto.

## Cómo ejecutar el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo .env a partir del ejemplo
cp .env.example .env

# 3. Levantar el servidor en modo desarrollo
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000/graphql`, donde se puede usar el playground (Apollo Sandbox) para probar las operaciones.

### Datos de ejemplo

La primera vez que se levanta el servidor con la base de datos vacía, se cargan
automáticamente algunos usuarios, proyectos y tareas de ejemplo (ver
`src/seed/seed.service.ts`). La carga es idempotente: si ya hay datos no se
vuelve a sembrar, por lo que los registros que se creen o modifiquen después se
conservan entre reinicios.

## Operaciones GraphQL

**Tareas**

- `tasks` — lista todas las tareas
- `task(id)` — obtiene una tarea por su id
- `createTask(input)` — crea una tarea
- `updateTask(id, input)` — edita una tarea (estado, etiquetas, responsable, etc.)
- `deleteTask(id)` — elimina una tarea

**Usuarios y proyectos**

- `users` / `user(id)` / `createUser(input)`
- `projects` / `project(id)` / `createProject(input)`

### Ejemplo

```graphql
mutation {
  createTask(
    input: {
      title: "Implementar login"
      description: "OAuth + JWT"
      tags: ["backend", "auth"]
      projectId: "<id-del-proyecto>"
      assignedUserId: "<id-del-usuario>"
    }
  ) {
    id
    status
    tags
    createdAt
    assignedUser {
      name
    }
    project {
      name
    }
  }
}
```

## Programación Orientada a Aspectos (AOP)

En NestJS los _concerns_ transversales (logging, manejo de errores, validación)
se separan de la lógica de negocio usando interceptors, filters, pipes y
decoradores. En este proyecto la AOP se aplica así:

| Aspecto                    | Dónde                                                | Qué hace                                                                                                |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Logging de operaciones** | `common/interceptors/logging.interceptor.ts`         | Interceptor global (_around advice_) que registra cada operación GraphQL, sus argumentos y su duración. |
| **Manejo de errores**      | `common/filters/all-exceptions.filter.ts`            | Filtro global que captura cualquier excepción, la registra y devuelve un error uniforme.                |
| **Medición de tiempos**    | `common/decorators/log-execution-time.decorator.ts` | Decorador propio (`@LogExecutionTime()`) que mide cuánto tarda un método de servicio.                   |
| **Validación**             | `ValidationPipe` global (en `main.ts`)               | Valida automáticamente todos los inputs antes de llegar al resolver.                                    |

Gracias a esto, los _services_ y _resolvers_ se mantienen limpios y enfocados
solo en la lógica del dominio.

## Logs

Los logs se manejan con **pino** (`nestjs-pino`). En desarrollo se muestran de
forma legible en consola (`pino-pretty`) y en producción salen como JSON
estructurado. El interceptor de logging y el filtro de excepciones escriben a
través de este mismo logger.

## Estructura del proyecto

```
src/
├── common/            # Artefactos de AOP (interceptor, filtro, decorador)
├── tasks/             # Entidad, DTOs, servicio, resolver y módulo de tareas
├── users/             # Módulo de usuarios
├── projects/          # Módulo de proyectos
├── app.module.ts      # Configuración raíz (DB, GraphQL, logger, aspectos)
└── main.ts            # Arranque del servidor
```
