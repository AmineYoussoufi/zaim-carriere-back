import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PieceDeRechange } from './entities/piece-de-rechange.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PieceDeRechangeService {
  constructor(
    @InjectRepository(PieceDeRechange)
    private repository: Repository<PieceDeRechange>,
  ) {}

  async create(createEntreeDto: any) {
    return await this.repository.save(createEntreeDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        vehicule: true,
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
