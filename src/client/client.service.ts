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
    // Parse the date
    const dateParts = date.split('/');
    let day: number | null = null;
    let month: number | null = null;
    let year: number;

    if (dateParts.length === 3) {
      [day, month, year] = dateParts.map((x) => parseInt(x));
    } else if (dateParts.length === 2) {
      [month, year] = dateParts.map((x) => parseInt(x));
    } else if (dateParts.length === 1) {
      year = parseInt(dateParts[0]);
    } else {
      throw new Error('Invalid date format. Use DD/MM/YYYY, MM/YYYY, or YYYY');
    }

    // First get all clients
    const clients = await this.repository
      .createQueryBuilder('client')
      .orderBy('client.name', 'ASC')
      .getMany();

    // Then calculate totals for each client separately to avoid join issues
    const results = await Promise.all(
      clients.map(async (client) => {
        // Execute all queries in parallel
        const [
          caResult,
          cashResult,
          creditResult,
          entreesResult,
          clientWithRelations,
        ] = await Promise.all([
          // Calculate CA from lignes
          this.repository
            .createQueryBuilder('client')
            .leftJoin(
              'client.bons',
              'bon',
              includeHistory
                ? 'bon.annee <= :year AND (bon.annee < :year OR bon.mois <= :month)'
                : this.getBonCondition(day, month, year),
              { day, month, year },
            )
            .leftJoin('bon.lignes', 'ligne')
            .select('SUM(ligne.quantite * ligne.prix)', 'total_ca')
            .where('client.id = :clientId', { clientId: client.id })
            .getRawOne(),

          // Calculate cash payments
          this.repository
            .createQueryBuilder('client')
            .leftJoin(
              'client.bons',
              'bon',
              includeHistory
                ? 'bon.annee <= :year AND (bon.annee < :year OR bon.mois <= :month)'
                : this.getBonCondition(day, month, year),
              { day, month, year },
            )
            .leftJoin('bon.paiements', 'paiement', 'paiement.type = "cash"')
            .select('SUM(paiement.montant)', 'total_cash')
            .where('client.id = :clientId', { clientId: client.id })
            .getRawOne(),

          // Calculate credit payments
          this.repository
            .createQueryBuilder('client')
            .leftJoin(
              'client.bons',
              'bon',
              includeHistory
                ? 'bon.annee <= :year AND (bon.annee < :year OR bon.mois <= :month)'
                : this.getBonCondition(day, month, year),
              { day, month, year },
            )
            .leftJoin('bon.paiements', 'paiement', 'paiement.type = "credit"')
            .select('SUM(paiement.montant)', 'total_credit')
            .where('client.id = :clientId', { clientId: client.id })
            .getRawOne(),

          // Calculate entrees
          this.repository
            .createQueryBuilder('client')
            .leftJoin(
              'client.entrees',
              'entree',
              includeHistory
                ? 'YEAR(entree.date) <= :year AND (YEAR(entree.date) < :year OR MONTH(entree.date) <= :month)'
                : this.getEntreeCondition(day, month, year),
              { day, month, year },
            )
            .select('SUM(entree.montant)', 'total_entrees')
            .where('client.id = :clientId', { clientId: client.id })
            .getRawOne(),

          // Get full client data with relations
          this.repository
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
            .leftJoinAndSelect('bon.lignes', 'ligne')
            .leftJoinAndSelect('bon.paiements', 'paiement')
            .where('client.id = :clientId', { clientId: client.id })
            .getOne(),
        ]);

        const totalCA = parseFloat(caResult?.total_ca || 0);
        const totalCash = parseFloat(cashResult?.total_cash || 0);
        const totalCredit = parseFloat(creditResult?.total_credit || 0);
        const totalEntrees = parseFloat(entreesResult?.total_entrees || 0);

        return {
          ...clientWithRelations,
          chiffreAffaire: totalCA,
          cash: totalCash,
          credit: totalCredit,
          entrees: totalEntrees,
          balance: totalCredit - totalEntrees,
        };
      }),
    );

    return results;
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
