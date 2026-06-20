import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Representa a un usuario del sistema, que puede ser responsable de una o
 * varias tareas.
 */
@ObjectType()
@Entity('users')
export class User {
  /** Identificador unico del usuario (UUID). */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nombre completo del usuario. */
  @Field()
  @Column()
  name: string;

  /** Correo electronico (unico) del usuario. */
  @Field()
  @Column({ unique: true })
  email: string;
}
