import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../task-status.enum';

/**
 * Tarea de un proyecto de desarrollo de software. Es la entidad central del
 * sistema de gestion.
 */
@ObjectType()
@Entity('tasks')
export class Task {
  /** Identificador unico de la tarea (UUID). */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Titulo corto de la tarea. */
  @Field()
  @Column()
  title: string;

  /** Descripcion detallada de la tarea. */
  @Field()
  @Column('text')
  description: string;

  /** Estado actual de la tarea. */
  @Field(() => TaskStatus)
  @Column({ type: 'simple-enum', enum: TaskStatus, default: TaskStatus.BACKLOG })
  status: TaskStatus;

  /** Etiquetas dinamicas asociadas a la tarea. */
  @Field(() => [String])
  @Column('simple-array')
  tags: string[];

  /** Fecha de creacion de la tarea (asignada automaticamente). */
  @Field()
  @CreateDateColumn()
  createdAt: Date;

  /** Usuario responsable de la tarea (puede no estar asignado todavia). */
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true, eager: true })
  assignedUser?: User | null;

  /** Proyecto al que pertenece la tarea. */
  @Field(() => Project)
  @ManyToOne(() => Project, { nullable: false, eager: true })
  project: Project;
}
