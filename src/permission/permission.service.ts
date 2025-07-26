import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    return await this.repository.save(createPermissionDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.repository.update({ id: id }, updatePermissionDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
