import { UserRepository } from './repository/user.repository';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const userCreate = this.userRepository.create(createUserDto);
      await this.checkDuplicate(createUserDto.email, createUserDto.telefone);
      await this.userRepository.save(userCreate);
      
      return { message: ` ${userCreate.email} cadastrado com sucesso` };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll(): Promise<CreateUserDto[]> {
    try {
      const list = await this.userRepository.find();
      return list;
    } catch (error) {
      throw new HttpException(error, 404);  
    }
  }

  async findOne(id: number): Promise<CreateUserDto> {
    try {
      const userReturn = await this.userRepository.findOne(id);
      if (!userReturn) {
        throw new NotFoundException({ message: 'Este usuário não existe' });
      }
      return userReturn;
    } catch (error) {
      throw new HttpException({error: 'olá'}, 404);    
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      await this.findOne(id);
      await this.checkDuplicate(updateUserDto.email, updateUserDto.telefone); 
      await this.userRepository.update({ id }, updateUserDto);

      return { message: ` Usuário atualizado com sucesso` };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const userDelete = await this.findOne(id);
      await this.userRepository.delete({ id });
      return { message: ` Usuário ${userDelete.nome} deletado com sucesso` };

    } catch (error) {
      throw new HttpException(error, 406);
    }
  }

  async checkDuplicate(email: string, telefone: string) {
    const userExists = await this.userRepository.find({
      where: [
        { email },
        { telefone }
      ]
    });

    if (userExists.length > 0) {
      throw new HttpException({
        status: 409,
        message: 'Email ou telefone já existem.'
      }, 409)
    }

    return;
  }
}
