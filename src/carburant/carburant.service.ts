import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carburant } from './entities/carburant.entity';
import { Between, Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class CarburantService {
  constructor(
    @InjectRepository(Carburant)
    private repository: Repository<Carburant>,
  ) {}

  async create(createEntreeDto: any) {
    return await this.repository.save(createEntreeDto);
  }

  async findAll(date?: string) {
    const queryBuilder = this.repository
      .createQueryBuilder('carburant')
      .leftJoinAndSelect('carburant.vehicule', 'vehicule')
      .leftJoinAndSelect('carburant.salarie', 'salarie');

    if (date) {
      // Parse MM-YYYY format
      const [month, year] = date.split('-').map(Number);

      // Create date range for the month
      const startDate = moment({ year, month: month - 1, day: 1 })
        .startOf('day')
        .toDate();
      const endDate = moment(startDate).endOf('month').toDate();

      queryBuilder.where({
        date: Between(startDate, endDate),
      });
    }

    return await queryBuilder.getMany();
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
