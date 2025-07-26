import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { Check } from './entities/check.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(Check)
    private checksRepository: Repository<Check>,
  ) {}

  async getList(): Promise<Check[]> {
    return this.checksRepository.find({
      relations: {
        client: true,
        fournisseur: true,
      },
    });
  }

  async getById(id: number): Promise<Check> {
    const check = await this.checksRepository.findOne({ where: { id } });
    if (!check) {
      throw new NotFoundException(`Check with id ${id} not found`);
    }
    return check;
  }

  async create(data: Partial<Check>): Promise<Check> {
    const check = this.checksRepository.create(data);
    return this.checksRepository.save(check);
  }

  async update(id: number, data: Partial<Check>): Promise<Check> {
    await this.checksRepository.update(id, data);
    return this.getById(id);
  }

  async remove(id: number): Promise<void> {
    await this.getById(id); // Ensure the check exists
    await this.checksRepository.delete(id);
  }
}
