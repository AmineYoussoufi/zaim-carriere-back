import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await this.repository.save(createUserDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        permissions: true,
      },
    });
  }

  async findOne(email: string) {
    return await this.repository.findOne({
      where: {
        email: email,
      },
      relations: {
        permissions: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.repository.update({ id: id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
