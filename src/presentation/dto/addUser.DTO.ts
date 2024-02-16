import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddAccountDTO {
	@ApiProperty()
	@IsString({ message: 'O campo "nome" precisa conter caracteres válidos' })
	@MaxLength(64, {
		message: 'O campo "nome" precisa conter no máximo 64 caracteres',
	})
	@MinLength(2, {
		message: 'O campo "nome" precisa conter no mínimo 2 caracteres',
	})
		name: string;

	@ApiProperty()
	@IsString({ message: 'O campo "email" precisa conter caracteres válidos' })
	@IsEmail({}, { message: 'O campo "email" precisa ser um email válido' })
		email: string;

	@ApiProperty()
	@IsString({ message: 'O campo "senha" precisa conter caracteres válidos' })
	@MaxLength(255, {
		message: 'O campo "senha" precisa conter no máximo 255 caracteres',
	})
	@MinLength(6, {
		message: 'O campo "senha" precisa conter no mínimo 6 caracteres',
	})
		password: string;
}
