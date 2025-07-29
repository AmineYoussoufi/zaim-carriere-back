import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Paiement } from 'src/bon/entities/paiement.entity';
import { Entree } from 'src/entree/entities/entree.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private repository: Repository<Client>,
    @InjectRepository(Paiement)
    private paymentRepository: Repository<Paiement>,
    @InjectRepository(Entree)
    private entreeRepository: Repository<Entree>,
  ) {}
  async create(createUserDto: CreateClientDto) {
    return await this.repository.save(createUserDto);
  }

  async findAll(options: IPaginationOptions) {
    if (options) return paginate<Client>(this.repository, options);
    else
      return await this.repository.find({
        relations: {
          vehicules: true,
        },
        order: {
          name: 'ASC',
        },
      });
  }

  async findFull(date: string, includeHistory: boolean = false) {
    // Parse the date based on its format
    const dateParts = date.split('/');
    let day: number | null = null;
    let month: number | null = null;
    let year: number;

    if (dateParts.length === 3) {
      // DD/MM/YYYY
      [day, month, year] = dateParts.map((x) => parseInt(x));
    } else if (dateParts.length === 2) {
      // MM/YYYY
      [month, year] = dateParts.map((x) => parseInt(x));
    } else if (dateParts.length === 1) {
      // YYYY
      year = parseInt(dateParts[0]);
    } else {
      throw new Error('Invalid date format. Use DD/MM/YYYY, MM/YYYY, or YYYY');
    }

    // First get the aggregated totals per client
    const totals = await this.repository
      .createQueryBuilder('client')
      .leftJoin(
        'client.entrees',
        'entree',
        includeHistory
          ? 'YEAR(entree.date) <= :year AND (YEAR(entree.date) < :year OR MONTH(entree.date) <= :month)'
          : this.getEntreeCondition(day, month, year),
        { day, month, year },
      )
      .leftJoin(
        'client.bons',
        'bon',
        includeHistory
          ? 'bon.annee <= :year AND (bon.annee < :year OR bon.mois <= :month)'
          : this.getBonCondition(day, month, year),
        { day, month, year },
      )
      .leftJoin('bon.paiements', 'paiement', 'paiement.type IN (:...types)', {
        types: ['cash', 'credit'],
      })
      .leftJoin('bon.lignes', 'ligne')
      .select([
        'client.id as client_id',
        'client.name as client_name',
        'SUM(ligne.quantite * ligne.prix) as total_ca',
        'SUM(CASE WHEN paiement.type = "cash" THEN paiement.montant ELSE 0 END) as total_cash',
        'SUM(CASE WHEN paiement.type = "credit" THEN paiement.montant ELSE 0 END) as total_credit',
        'SUM(entree.montant) as total_entrees',
      ])
      .groupBy('client.id')
      .orderBy('client.name', 'ASC')
      .getRawMany();

    // Then get the full client data with relations
    const clients = await this.repository
      .createQueryBuilder('client')
      .leftJoinAndSelect(
        'client.entrees',
        'entree',
        includeHistory
          ? 'YEAR(entree.date) <= :year AND (YEAR(entree.date) < :year OR MONTH(entree.date) <= :month)'
          : this.getEntreeCondition(day, month, year),
        { day, month, year },
      )
      .leftJoinAndSelect(
        'client.bons',
        'bon',
        includeHistory
          ? 'bon.annee <= :year AND (bon.annee < :year OR bon.mois <= :month)'
          : this.getBonCondition(day, month, year),
        { day, month, year },
      )
      .leftJoinAndSelect(
        'bon.paiements',
        'paiement',
        'paiement.type IN (:...types)',
        {
          types: ['cash', 'credit', 'check'],
        },
      )
      .leftJoinAndSelect('bon.lignes', 'ligne')
      .where('client.id IN (:...ids)', { ids: totals.map((t) => t.client_id) })
      .orderBy('client.name', 'ASC')
      .getMany();

    // Combine the results
    return clients.map((client) => {
      const clientTotals = totals.find((t) => t.client_id === client.id);
      return {
        ...client,
        chiffreAffaire: parseFloat(clientTotals?.total_ca || 0),
        cash: parseFloat(clientTotals?.total_cash || 0),
        credit: parseFloat(clientTotals?.total_credit || 0),
        entrees: parseFloat(clientTotals?.total_entrees || 0),
        balance:
          parseFloat(clientTotals?.total_credit || 0) -
          parseFloat(clientTotals?.total_entrees || 0),
      };
    });
  }

  private getBonCondition(
    day: number | null,
    month: number | null,
    year: number,
  ): string {
    if (day !== null && month !== null) {
      return 'bon.jour = :day AND bon.mois = :month AND bon.annee = :year';
    } else if (month !== null) {
      return 'bon.mois = :month AND bon.annee = :year';
    } else {
      return 'bon.annee = :year';
    }
  }

  private getEntreeCondition(
    day: number | null,
    month: number | null,
    year: number,
  ): string {
    if (day !== null && month !== null) {
      return 'DAY(entree.date) = :day AND MONTH(entree.date) = :month AND YEAR(entree.date) = :year';
    } else if (month !== null) {
      return 'MONTH(entree.date) = :month AND YEAR(entree.date) = :year';
    } else {
      return 'YEAR(entree.date) = :year';
    }
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        vehicules: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateClientDto) {
    return await this.repository.update({ id: id }, updateUserDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  async getCreditsClients(client: number) {
    const resultCredits: any = await this.paymentRepository.find({
      where: {
        bon: {
          client: {
            id: client,
          },
        },
        type: 'credit',
      },
    });
    const resultEntrees: any = await this.entreeRepository.find({
      where: {
        client: {
          id: client,
        },
      },
    });
    let soldeCredit = 0;
    let montantPaye = 0;
    resultCredits.forEach((credit: Paiement) => {
      soldeCredit += credit.montant;
    });

    resultEntrees.forEach((entree: Entree) => {
      montantPaye += entree.montant;
    });

    return { soldeCredit, montantPaye };
  }
}
