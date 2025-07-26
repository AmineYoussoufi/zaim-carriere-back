// fournisseur.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fournisseur } from './entities/fournisseur.entity';

@Injectable()
export class FournisseurService {
  constructor(
    @InjectRepository(Fournisseur)
    private readonly fournisseurRepository: Repository<Fournisseur>,
  ) {}

  findAll(): Promise<Fournisseur[]> {
    return this.fournisseurRepository.find();
  }

  findOne(id: number): Promise<Fournisseur | null> {
    return this.fournisseurRepository.findOneBy({ id });
  }

  create(fournisseur: Fournisseur): Promise<Fournisseur> {
    return this.fournisseurRepository.save(fournisseur);
  }

  async update(id: number, fournisseur: Fournisseur): Promise<void> {
    await this.fournisseurRepository.update(id, fournisseur);
  }

  async remove(id: number): Promise<void> {
    await this.fournisseurRepository.delete(id);
  }
}
