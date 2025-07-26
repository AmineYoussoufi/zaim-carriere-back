import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salaire } from './entities/salaire.entity';
import moment from 'moment';

@Injectable()
export class SalaireService {
  constructor(
    @InjectRepository(Salaire)
    private repository: Repository<Salaire>,
  ) {}

  async create(createEntreeDto: any) {
    //createEntreeDto.date = moment(createEntreeDto.date,'YYYY-MM-DD').format('DD/MM/YYYY')
    return await this.repository.save(createEntreeDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
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
