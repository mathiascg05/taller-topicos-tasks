import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Datos necesarios para registrar un nuevo usuario.
 */
@InputType()
export class CreateUserInput {
  /** Nombre completo del usuario. */
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Correo electronico valido del usuario. */
  @Field()
  @IsEmail()
  email: string;
}
