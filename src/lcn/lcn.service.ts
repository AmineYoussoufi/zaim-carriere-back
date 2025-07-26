import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lcn } from './entities/lcn.entity';

@Injectable()
export class LcnService {
  constructor(
    @InjectRepository(Lcn)
    private readonly lcnRepository: Repository<Lcn>,
  ) {}

  async create(lcnData: any): Promise<any> {
    const lcn = this.lcnRepository.create(lcnData);
    return this.lcnRepository.save(lcn);
  }

  async findAll(): Promise<Lcn[]> {
    return this.lcnRepository.find({
      relations: {
        client: true,
        fournisseur: true,
      },
    });
  }

  async findOne(id: number): Promise<Lcn> {
    const lcn = await this.lcnRepository.findOne({ where: { id } });
    if (!lcn) {
      throw new NotFoundException(`LCN with ID ${id} not found`);
    }
    return lcn;
  }

  async findByChecklcnNumber(checklcnNumber: string): Promise<Lcn> {
    const lcn = await this.lcnRepository.findOne({
      where: { checklcnNumber },
    });
    if (!lcn) {
      throw new NotFoundException(
        `LCN with number ${checklcnNumber} not found`,
      );
    }
    return lcn;
  }

  async update(id: number, updateData: any): Promise<Lcn> {
    const lcn = await this.lcnRepository.preload({
      id,
      ...updateData,
    });

    if (!lcn) {
      throw new NotFoundException(`LCN with ID ${id} not found`);
    }

    return this.lcnRepository.save(lcn);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lcnRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`LCN with ID ${id} not found`);
    }
  }

  async markAsEncaisse(id: number): Promise<Lcn> {
    const lcn = await this.findOne(id);
    lcn.encaisse = true;
    return this.lcnRepository.save(lcn);
  }

  async getLcnsByClient(clientId: number): Promise<Lcn[]> {
    return this.lcnRepository.find({
      where: { client: { id: clientId } },
    });
  }

  async getLcnsByFournisseur(fournisseurId: number): Promise<Lcn[]> {
    return this.lcnRepository.find({
      where: { fournisseur: { id: fournisseurId } },
    });
  }

  async getTotalAmountByClient(clientId: number): Promise<number> {
    const result = await this.lcnRepository
      .createQueryBuilder('lcn')
      .select('SUM(lcn.amount)', 'total')
      .where('lcn.clientId = :clientId', { clientId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getTotalAmountByFournisseur(fournisseurId: number): Promise<number> {
    const result = await this.lcnRepository
      .createQueryBuilder('lcn')
      .select('SUM(lcn.amount)', 'total')
      .where('lcn.fournisseurId = :fournisseurId', { fournisseurId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }
}
