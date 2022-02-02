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

  async findAll(): Promise<any> {
    try {
      const list = await this.userRepository.find();
      if (!list.length) {
        throw new NotFoundException({ message: 'Não foram encontrados itens' });
      }
      return list;
    } catch (error) {
      throw new HttpException(error, 404);  
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
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
