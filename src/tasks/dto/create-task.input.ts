import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../task-status.enum';

/**
 * Datos necesarios para crear una nueva tarea.
 */
@InputType()
export class CreateTaskInput {
  /** Titulo corto de la tarea. */
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  /** Descripcion detallada de la tarea. */
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  /** Estado inicial de la tarea. Si no se indica, se usa BACKLOG. */
  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /** Etiquetas iniciales de la tarea. */
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /** Id del proyecto al que pertenece la tarea. */
  @Field(() => ID)
  @IsUUID()
  projectId: string;

  /** Id del usuario responsable (opcional). */
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
