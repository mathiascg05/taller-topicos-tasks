import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ProjectsModule } from './projects/projects.module';
import { SeedModule } from './seed/seed.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

/**
 * Modulo raiz de la aplicacion. Configura la base de datos (SQLite + TypeORM),
 * el logger estructurado (pino), la API GraphQL y registra de forma global los
 * aspectos transversales (interceptor de logging y filtro de excepciones).
 */
@Module({
  imports: [
    // Carga de variables de entorno desde el archivo .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Logger estructurado con pino. En desarrollo se usa pino-pretty para que
    // los logs sean legibles en consola.
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get<string>('LOG_LEVEL', 'info'),
          autoLogging: false,
          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty', options: { singleLine: true } }
              : undefined,
        },
      }),
    }),

    // Conexion a la base de datos SQLite mediante TypeORM.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get<string>('DATABASE_PATH', 'database.sqlite'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // API GraphQL con enfoque code-first: el esquema se genera a partir de los
    // decoradores de las entidades y resolvers.
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    TasksModule,
    UsersModule,
    ProjectsModule,
    SeedModule,
  ],
  providers: [
    // Aspecto transversal: logging de todas las operaciones GraphQL.
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Aspecto transversal: manejo centralizado de errores.
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
