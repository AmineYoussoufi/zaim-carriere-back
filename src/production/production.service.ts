// src/Production/Production.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Production } from './entities/production.entity';
import { Machine } from '../machine/entities/machine.entity';
import { Produit } from '../produit/entities/produit.entity';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private ProductionRepository: Repository<Production>,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
    @InjectRepository(Produit)
    private ProduitRepository: Repository<Produit>,
  ) {}

  async create(createProductionDto: any): Promise<any> {
    const machine = await this.machineRepository.findOne({
      where: { id: createProductionDto.machineId },
    });
    if (!machine) {
      throw new NotFoundException(
        `Machine with ID ${createProductionDto.machineId} not found`,
      );
    }

    const Produit = await this.ProduitRepository.findOne({
      where: { id: createProductionDto.ProduitId },
    });
    if (!Produit) {
      throw new NotFoundException(
        `Produit with ID ${createProductionDto.ProduitId} not found`,
      );
    }

    const Production = this.ProductionRepository.create({
      ...createProductionDto,
      machine,
      Produit,
    });

    return this.ProductionRepository.save(Production);
  }

  async findAll(filters: any): Promise<{ data: Production[]; count: number }> {
    const { page, limit, machineId, ProduitId, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (machineId) where.machine = { id: machineId };
    if (ProduitId) where.Produit = { id: ProduitId };
    if (status) where.status = status;

    const [data, count] = await this.ProductionRepository.findAndCount({
      where,
      relations: ['machine', 'produit'],
      skip,
      take: limit,
      order: { startDate: 'DESC' },
    });

    return { data, count };
  }

  async findOne(id: number): Promise<Production> {
    const Production = await this.ProductionRepository.findOne({
      where: { id },
      relations: ['machine', 'produit'],
    });

    if (!Production) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }

    return Production;
  }

  async update(id: number, updateProductionDto: any): Promise<Production> {
    const Production = await this.findOne(id);

    if (updateProductionDto.machineId) {
      const machine = await this.machineRepository.findOne({
        where: { id: updateProductionDto.machineId },
      });
      if (!machine) {
        throw new NotFoundException(
          `Machine with ID ${updateProductionDto.machineId} not found`,
        );
      }
      Production.machine = machine;
    }

    if (updateProductionDto.ProduitId) {
      const Produit = await this.ProduitRepository.findOne({
        where: { id: updateProductionDto.ProduitId },
      });
      if (!Produit) {
        throw new NotFoundException(
          `Produit with ID ${updateProductionDto.ProduitId} not found`,
        );
      }
      Production.produit = Produit;
    }

    Object.assign(Production, updateProductionDto);
    return this.ProductionRepository.save(Production);
  }

  async remove(id: number): Promise<void> {
    const Production = await this.findOne(id);
    await this.ProductionRepository.remove(Production);
  }

  async getProductionStats(): Promise<any> {
    // Implement your statistics logic here
    return {
      totalProductions: await this.ProductionRepository.count(),
      completedProductions: await this.ProductionRepository.count({
        where: { status: 'completed' },
      }),
      // Add more stats as needed
    };
  }
}
