import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Representa un proyecto de desarrollo de software al que pertenecen las
 * tareas.
 */
@ObjectType()
@Entity('projects')
export class Project {
  /** Identificador unico del proyecto (UUID). */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nombre del proyecto. */
  @Field()
  @Column()
  name: string;

  /** Descripcion opcional del proyecto. */
  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;
}
