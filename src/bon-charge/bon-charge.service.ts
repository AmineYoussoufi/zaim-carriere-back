import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BonCharge } from './entities/bon-charge.entity';
import { LigneBonCharge } from './entities/ligneBonCharge.entity';

@Injectable()
export class BonChargeService {
  constructor(
    @InjectRepository(BonCharge)
    private readonly bonChargeRepository: Repository<BonCharge>,
    @InjectRepository(LigneBonCharge)
    private readonly ligneBonRepository: Repository<LigneBonCharge>,
  ) {}

  async findLatest() {
    const latest = (
      await this.bonChargeRepository.find({
        order: { id: 'DESC' },
      })
    )[0];
    const numero = latest ? latest.numero.split('/')[0] : '0';
    const annee = latest
      ? latest.numero.split('/')[1]
      : new Date().getFullYear().toString();
    return { numero, annee };
  }

  // Create a new BonCharge
  async create(bonChargeData: Partial<BonCharge>): Promise<BonCharge> {
    return this.bonChargeRepository.save(bonChargeData);
  }

  // Find all BonCharge records
  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ data: BonCharge[]; total: number }> {
    const [data, total] = await this.bonChargeRepository.findAndCount({
      where: search ? { numero: Like(`${search}%`) } : {},
      relations: {
        fournisseur: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
    };
  }

  // Find one BonCharge by ID
  async findOne(id: number): Promise<BonCharge> {
    const bonCharge = await this.bonChargeRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        lignes: { destinations: { machine: true, vehicle: true } },
        fournisseur: true,
      },
    });
    if (!bonCharge) {
      throw new Error('BonCharge not found');
    }
    return bonCharge;
  }

  // Update an existing BonCharge
  async update(bonChargeData: Partial<BonCharge>): Promise<BonCharge> {
    return this.bonChargeRepository.save(bonChargeData);
  }

  // Delete a BonCharge
  async remove(id: number): Promise<void> {
    const bonCharge = await this.findOne(id);
    await this.bonChargeRepository.remove(bonCharge);
  }

  async getSituation(filters: any) {
    const situation = {
      bons: [],
    };
    filters.dateEmission = Like(filters.date + '%');
    delete filters.date;

    // Fetch bons (invoices/orders) with relations
    situation.bons = await this.bonChargeRepository.find({
      where: filters,
      relations: {
        fournisseur: true,
        lignes: true,
        paiements: true,
      },
    });

    return situation;
  }
}
