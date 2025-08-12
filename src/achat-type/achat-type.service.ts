import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchatType } from './entities/achat-type.entity';

@Injectable()
export class AchatTypesService {
  constructor(
    @InjectRepository(AchatType)
    private readonly achatTypeRepository: Repository<AchatType>,
  ) {}

  async create(createAchatTypeDto: any): Promise<any> {
    const achatType = this.achatTypeRepository.create(createAchatTypeDto);
    return await this.achatTypeRepository.save(achatType);
  }

  async findAll(): Promise<AchatType[]> {
    return await this.achatTypeRepository.find();
  }

  async findOne(id: number): Promise<AchatType> {
    return await this.achatTypeRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAchatTypeDto: any): Promise<any> {
    await this.achatTypeRepository.update(id, updateAchatTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.achatTypeRepository.delete(id);
  }
}
