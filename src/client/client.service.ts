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

  async findFull(date: string) {
    const [month, year] = date.split('/').map((x) => parseInt(x));

    return await this.repository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.entrees', 'entree')
      .leftJoinAndSelect('client.bons', 'bon')
      .leftJoinAndSelect('bon.paiements', 'paiement')
      .where(
        `(entree.date LIKE :date OR entree.date IS NULL) 
        AND (bon.mois = :month AND bon.annee = :year) 
        AND (paiement.type IN (:...types) OR paiement.type IS NULL)`,
        {
          date: `%${date}`,
          month,
          year,
          types: ['cash', 'credit'],
        },
      )
      .orderBy('client.name', 'ASC')
      .getMany();
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
