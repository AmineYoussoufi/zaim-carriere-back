import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Devis } from './entities/devis.entity';
import { Like, Repository } from 'typeorm';
import { LigneDevis } from './entities/ligneDevis.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private repository: Repository<Devis>,

    @InjectRepository(LigneDevis)
    private ligneRepo: Repository<LigneDevis>,
  ) {}

  async create(createDevisDto: any) {
    return await this.repository.save(createDevisDto);
  }

  async findAll(
    options: IPaginationOptions,
    query: string,
    status: string = null,
  ) {
    const more_options: any = {
      relations: ['client', 'lignes'],
      where: status ? { statut: status } : {},
    };
    if (query.length > 0) {
      more_options.where = [{ numero: Like(query + '%') }];
    }
    return paginate(this.repository, options, more_options);
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        lignes: {
          produit: true,
        },
        client: true,
      },
    });
  }

  async findLatest() {
    const latest: any = (
      await this.repository.find({
        order: { id: 'DESC' },
      })
    )[0];
    if (latest) {
      const numero = latest.numero.split('/')[0];
      const annee = latest.numero.split('/')[1];
      return { numero, annee };
    } else return { numero: '0', annee: new Date().getFullYear().toString() };
  }

  async findThisYear() {
    return await this.repository.find({
      where: {
        annee: new Date().getFullYear(),
      },
    });
  }

  async update(id: number, updateDevisDto: any) {
    return await this.repository.update({ id: id }, updateDevisDto);
  }

  async remove(id: number) {
    const lignes = await this.ligneRepo.find({
      where: {
        devis: {
          id: id,
        },
      },
    });

    // Delete all related lines first
    await Promise.all(lignes.map((ligne) => this.ligneRepo.delete(ligne.id)));

    // Then delete the devis
    return await this.repository.delete(id);
  }

  async updateStatus(id: number, status: string) {
    return await this.repository.update(id, { statut: status });
  }

  async getClientDevis(clientId: number) {
    return await this.repository.find({
      where: {
        client: { id: clientId },
      },
      relations: ['lignes.produit'],
      order: { id: 'DESC' },
    });
  }
}
