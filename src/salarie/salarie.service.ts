import { Injectable } from '@nestjs/common';
import { CreateSalarieDto } from './dto/create-salarie.dto';
import { UpdateSalarieDto } from './dto/update-salarie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Salarie } from './entities/salarie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalarieService {
  constructor(
    @InjectRepository(Salarie)
    private repository: Repository<Salarie>,
  ) {}

  async create(createEntreeDto: CreateSalarieDto) {
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

  async update(id: number, updateEntreeDto: UpdateSalarieDto) {
    return await this.repository.update({ id: id }, updateEntreeDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
