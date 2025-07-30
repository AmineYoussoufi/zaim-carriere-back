import { Injectable } from '@nestjs/common';
import { CreateBonDto } from './dto/create-bon.dto';
import { UpdateBonDto } from './dto/update-bon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bon } from './entities/bon.entity';
import { Like, Repository } from 'typeorm';
import { LigneBon } from './entities/ligneBon.entity';
import { Paiement } from './entities/paiement.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import moment from 'moment';

@Injectable()
export class BonService {
  constructor(
    @InjectRepository(Bon)
    private repository: Repository<Bon>,

    @InjectRepository(LigneBon)
    private ligneRepo: Repository<LigneBon>,

    @InjectRepository(LigneBon)
    private PayRepo: Repository<Paiement>,
  ) {}
  async create(createUserDto: CreateBonDto) {
    return await this.repository.save(createUserDto);
  }

  async findAll(options: IPaginationOptions, query: string) {
    let more_options = {
      relations: ['client', 'vehicule', 'lignes'],
      where: {},
    };
    if (query.length > 0) {
      more_options.where = [{ numero: Like(query + '%') }];
    }
    return paginate(this.repository, options, more_options);
  }

  async getSituation(filters: any) {
    let situation = {
      bons: [],
      produits: [],
    };

    // Fetch bons (invoices/orders) with relations
    situation.bons = await this.repository.find({
      where: filters,
      relations: {
        client: true,
        lignes: {
          produit: true,
        },
        vehicule: true,
        paiements: true,
      },
    });

    // Fetch product quantities per client with filters applied
    let query = this.ligneRepo
      .createQueryBuilder('ligneBon')
      .leftJoin('ligneBon.bon', 'bon') // Join bons to get client info
      .leftJoin('bon.client', 'client') // Ensure client is joined correctly
      .leftJoin('ligneBon.produit', 'produit') // Join with product
      .select([
        'client.id AS clientId',
        'client.name AS clientName',
        'produit.id AS produitId',
        'produit.name AS produitName',
        'SUM(ligneBon.quantite) AS qtes',
      ])
      .groupBy('client.id, client.name, produit.id, produit.name');
    // Apply date filters if provided
    if (filters.jour) {
      query.andWhere('bon.jour = :jour', { jour: filters.jour });
    }
    if (filters.mois) {
      query.andWhere('bon.mois = :mois', { mois: filters.mois });
    }
    if (filters.annee) {
      query.andWhere('bon.annee = :annee', { annee: filters.annee });
    }

    situation.produits = await query.getRawMany();
    // Apply client filter if provided
    if (filters.client) {
      situation.produits = situation.produits.filter(
        (element: any) => element.clientId == filters.client.id,
      );
    } else {
      let results = [];
      situation.produits.reduce(function (res, value) {
        if (!res[value.produitId]) {
          res[value.produitId] = {
            produitId: value.produitId,
            produitName: value.produitName,
            qtes: 0,
          };
          results.push(res[value.produitId]);
        }
        res[value.produitId].qtes += parseFloat(value.qtes);
        return res;
      }, {});
      situation.produits = results;
    }

    return situation;
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
        paiements: {
          bon: true,
        },
        client: {
          vehicules: true,
        },
        vehicule: true,
      },
    });
  }
  async findLatest() {
    let latest = (
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

  async update(id: number, updateUserDto: UpdateBonDto) {
    return await this.repository.update({ id: id }, updateUserDto);
  }

  async remove(id: number) {
    const lignes = this.ligneRepo.find({
      where: {
        bon: {
          id: id,
        },
      },
    });

    const paiements = this.ligneRepo.find({
      where: {
        bon: {
          id: id,
        },
      },
    });

    (await lignes).forEach((ligne) => {
      this.ligneRepo.delete(ligne.id);
    });
    (await paiements).forEach((pay) => {
      this.PayRepo.delete(pay.id);
    });
    return await this.repository.delete(id);
  }

  async bulkUpdateAllBonsMontant(): Promise<{ updatedCount: number }> {
    // First update bons with lignes
    const updateWithLignes = await this.repository
      .createQueryBuilder()
      .update(Bon)
      .set({
        montant: () => `(
                SELECT COALESCE(SUM(l.quantite * l.prix), 0) + transport - remise
                FROM ligne_bon l
                WHERE l.bonId = Bon.id
            )`,
      })
      .where('id IN (SELECT DISTINCT bonId FROM ligne_bon)')
      .execute();

    return {
      updatedCount: updateWithLignes.affected || 0,
    };
  }
}
