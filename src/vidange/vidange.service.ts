// src/vidange/vidange.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vidange } from './entities/vidange.entity';

@Injectable()
export class VidangeService {
  constructor(
    @InjectRepository(Vidange)
    private vidangeRepository: Repository<Vidange>,
  ) {}

  async create(createVidangeDto: any): Promise<any> {
    return await this.vidangeRepository.save(createVidangeDto);
  }

  async findAll(): Promise<Vidange[]> {
    return await this.vidangeRepository.find({
      relations: ['vehicule', 'machine'],
    });
  }

  async findOne(id: number): Promise<Vidange> {
    const vidange = await this.vidangeRepository.findOne({
      where: { id },
      relations: ['vehicule', 'machine'],
    });

    if (!vidange) {
      throw new NotFoundException(`Vidange with ID ${id} not found`);
    }

    return vidange;
  }

  async update(id: number, updateVidangeDto: any): Promise<Vidange> {
    const vidange = await this.findOne(id);
    this.vidangeRepository.merge(vidange, updateVidangeDto);
    return await this.vidangeRepository.save(vidange);
  }

  async remove(id: number): Promise<void> {
    const vidange = await this.findOne(id);
    await this.vidangeRepository.remove(vidange);
  }

  async findByVehicule(vehiculeId: number): Promise<Vidange[]> {
    return await this.vidangeRepository.find({
      where: { vehiculeId },
      relations: ['vehicule'],
      order: { date: 'DESC' },
    });
  }

  async findByMachine(machineId: number): Promise<Vidange[]> {
    return await this.vidangeRepository.find({
      where: { machineId },
      relations: ['machine'],
      order: { date: 'DESC' },
    });
  }
}
