import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Você deve informar seu nome.' })
    nome: number;

    @IsEmail({ message: 'Você deve informar um email válido.' })
    email: string;

    idade: number;

    @IsNotEmpty({ message: 'Você deve informar um telefone de contato.' })
    telefone: string;
}
