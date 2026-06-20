import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Datos necesarios para crear un nuevo proyecto.
 */
@InputType()
export class CreateProjectInput {
  /** Nombre del proyecto. */
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Descripcion opcional del proyecto. */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
