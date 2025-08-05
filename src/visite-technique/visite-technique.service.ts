// src/visite-technique/visite-technique.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisiteTechnique } from './entities/visite-technique.entity';
import { VehiculeService } from '../vehicule/vehicule.service';

@Injectable()
export class VisiteTechniqueService {
  constructor(
    @InjectRepository(VisiteTechnique)
    private readonly visiteTechniqueRepository: Repository<VisiteTechnique>,
    private readonly vehiculeService: VehiculeService,
  ) {}

  async create(vehiculeId: number, createDto: any): Promise<any> {
    const vehicule = await this.vehiculeService.findOne(vehiculeId);
    if (!vehicule) {
      throw new NotFoundException(`Vehicule with ID ${vehiculeId} not found`);
    }

    const visite = this.visiteTechniqueRepository.create({
      ...createDto,
      vehicule,
    });

    return this.visiteTechniqueRepository.save(visite);
  }

  async findAllByVehicule(vehiculeId: number): Promise<VisiteTechnique[]> {
    return this.visiteTechniqueRepository.find({
      where: { vehicule: { id: vehiculeId } },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<VisiteTechnique> {
    const visite = await this.visiteTechniqueRepository.findOne({
      where: { id },
      relations: ['vehicule'],
    });

    if (!visite) {
      throw new NotFoundException(`Visite technique with ID ${id} not found`);
    }

    return visite;
  }

  async update(id: number, updateDto: any): Promise<VisiteTechnique> {
    const visite = await this.findOne(id);
    Object.assign(visite, updateDto);
    return this.visiteTechniqueRepository.save(visite);
  }

  async remove(id: number): Promise<void> {
    const visite = await this.findOne(id);
    await this.visiteTechniqueRepository.remove(visite);
  }
}
