import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineType } from './entities/machine-type.entity';

@Injectable()
export class MachineTypesService {
  constructor(
    @InjectRepository(MachineType)
    private readonly machineTypeRepository: Repository<MachineType>,
  ) {}

  async create(createMachineTypeDto: any): Promise<any> {
    const machineType = this.machineTypeRepository.create(createMachineTypeDto);
    return await this.machineTypeRepository.save(machineType);
  }

  async findAll(): Promise<MachineType[]> {
    return await this.machineTypeRepository.find();
  }

  async findOne(id: number): Promise<MachineType> {
    return await this.machineTypeRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMachineTypeDto: any): Promise<MachineType> {
    await this.machineTypeRepository.update(id, updateMachineTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.machineTypeRepository.delete(id);
  }
}
