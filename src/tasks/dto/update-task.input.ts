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
 * Datos que se pueden modificar de una tarea existente. Todos los campos son
 * opcionales: solo se actualiza lo que venga en el input. Cubre el cambio de
 * estatus, etiquetas y usuario responsable que pide el enunciado.
 */
@InputType()
export class UpdateTaskInput {
  /** Nuevo titulo de la tarea. */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  /** Nueva descripcion de la tarea. */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  /** Nuevo estado de la tarea. */
  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  /** Nueva lista de etiquetas (reemplaza la anterior). */
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /** Nuevo proyecto al que pertenece la tarea. */
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  /** Nuevo usuario responsable de la tarea. */
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;
}
