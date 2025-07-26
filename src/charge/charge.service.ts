import { Injectable } from '@nestjs/common';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Charge } from './entities/charge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Charge)
    private repository: Repository<Charge>,
  ) {}

  async create(createChargeDto: CreateChargeDto) {
    return await this.repository.save(createChargeDto);
  }

  async findAll() {
    return await this.repository.find({
      relations: {
        fournisseur: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        fournisseur: true,
      },
    });
  }

  async update(id: number, updateChargeDto: UpdateChargeDto) {
    return await this.repository.update({ id: id }, updateChargeDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }
}
