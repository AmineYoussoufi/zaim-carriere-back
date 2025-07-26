import { Injectable } from '@nestjs/common';
import { CreateEntreeDto } from './dto/create-entree.dto';
import { UpdateEntreeDto } from './dto/update-entree.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entree } from './entities/entree.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntreeService {
  constructor(
    @InjectRepository(Entree)
    private repository: Repository<Entree>,
  ) {}

  async create(createEntreeDto: CreateEntreeDto) {
    return await this.repository.save(createEntreeDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        client: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        client: true,
      },
    });
  }

  async findByClient(id: number) {
    return await this.repository.findOne({
      where: {
        client: {
          id: id,
        },
      },
      relations: {
        client: true,
      },
    });
  }

  async update(id: number, updateEntreeDto: UpdateEntreeDto) {
    return await this.repository.update({ id: id }, updateEntreeDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
