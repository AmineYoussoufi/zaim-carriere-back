import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carburant } from './entities/carburant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarburantService {
  constructor(
    @InjectRepository(Carburant)
    private repository: Repository<Carburant>,
  ) {}

  async create(createEntreeDto: any) {
    return await this.repository.save(createEntreeDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        vehicule: true,
        salarie: true,
      },
    });
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
