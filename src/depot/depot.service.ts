import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Depot } from './entities/depot.entity';

@Injectable()
export class DepotService {
  constructor(
    @InjectRepository(Depot)
    private repository: Repository<Depot>,
  ) {}

  async create(createEntreeDto: any) {
    return await this.repository.save(createEntreeDto);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateEntreeDto: any) {
    return await this.repository.update({ id: id }, updateEntreeDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
