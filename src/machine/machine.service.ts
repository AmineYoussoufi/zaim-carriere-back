// src/machines/machines.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) {}

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const machine = this.machineRepository.create(createMachineDto);
    return await this.machineRepository.save(machine);
  }

  async findAll(): Promise<Machine[]> {
    return await this.machineRepository.find({
      relations: ['piecesDeRechange', 'produits'],
    });
  }

  async findOne(id: number): Promise<Machine> {
    const machine = await this.machineRepository.findOne({
      where: { id },
      relations: ['produits'],
    });
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return machine;
  }

  async update(
    id: number,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    const machine = await this.findOne(id);
    this.machineRepository.merge(machine, updateMachineDto);
    return await this.machineRepository.save(machine);
  }

  async remove(id: number): Promise<void> {
    const machine = await this.findOne(id);
    await this.machineRepository.remove(machine);
  }
}
