import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LigneBonCharge } from 'src/bon-charge/entities/ligneBonCharge.entity';
import { Bon } from 'src/bon/entities/bon.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';
import { Carburant } from 'src/carburant/entities/carburant.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Depot } from 'src/depot/entities/depot.entity';
import { Entree } from 'src/entree/entities/entree.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { Salaire } from 'src/salaire/entities/salaire.entity';
import { Between, Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class CaisseService {
  @InjectRepository(Salaire)
  private payRepo: Repository<Salaire>;

  @InjectRepository(Paiement)
  private paymRepo: Repository<Paiement>;

  @InjectRepository(Entree)
  private inRepo: Repository<Entree>;

  @InjectRepository(Charge)
  private outRepo: Repository<Charge>;

  @InjectRepository(Bon)
  private bonRepo: Repository<Bon>;

  @InjectRepository(Depot)
  private bankRepo: Repository<Depot>;

  @InjectRepository(Carburant)
  private fuelRepo: Repository<Carburant>;

  @InjectRepository(PieceDeRechange)
  private piecesRepo: Repository<PieceDeRechange>;

  @InjectRepository(LigneBonCharge)
  private ligneBonChargeRepo: Repository<LigneBonCharge>;

  private parseDate(date: string): {
    startDate: Date;
    endDate: Date;
    month?: number;
    year: number;
  } {
    const parts = date.split('/');
    let startDate: Date;
    let endDate: Date;
    let month: number | undefined;
    let year: number;

    if (parts.length === 3) {
      // DD/MM/YYYY
      const [day, monthPart, yearPart] = parts.map(Number);
      startDate = moment([yearPart, monthPart - 1, day])
        .startOf('day')
        .toDate();
      endDate = moment([yearPart, monthPart - 1, day])
        .endOf('day')
        .toDate();
      month = monthPart;
      year = yearPart;
    } else if (parts.length === 2) {
      // MM/YYYY
      const [monthPart, yearPart] = parts.map(Number);
      startDate = moment([yearPart, monthPart - 1])
        .startOf('month')
        .toDate();
      endDate = moment([yearPart, monthPart - 1])
        .endOf('month')
        .toDate();
      month = monthPart;
      year = yearPart;
    } else if (parts.length === 1) {
      // YYYY
      year = Number(parts[0]);
      startDate = moment([year]).startOf('year').toDate();
      endDate = moment([year]).endOf('year').toDate();
    } else {
      throw new Error('Invalid date format. Use DD/MM/YYYY, MM/YYYY, or YYYY');
    }

    return { startDate, endDate, month, year };
  }

  async getGeneralCurrent(date: string) {
    const { startDate, endDate, month, year } = this.parseDate(date);

    // For Bon entities that use mois/annee
    const bonWhere: any = {};
    if (month) {
      bonWhere.mois = month;
    }
    bonWhere.annee = year;

    const bons = await this.bonRepo.find({
      relations: {
        paiements: true,
      },
      where: bonWhere,
      select: ['paiements'],
    });

    const entrees_list = await this.inRepo.find({
      where: {
        date: Between(
          moment(startDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        ),
      },
    });

    const charges_list = await this.outRepo.find({
      where: {
        date: Between(
          moment(startDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        ),
      },
    });

    const salaire_list = await this.payRepo.find({
      where: {
        date: Between(
          moment(startDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        ),
      },
    });

    const bank_list = await this.bankRepo.find({
      where: {
        date: Between(
          moment(startDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        ),
      },
    });

    const fuel_list = await this.fuelRepo.find({
      where: {
        date: Between(
          moment(startDate).format('YYYY-MM-DD'),
          moment(endDate).format('YYYY-MM-DD'),
        ),
      },
    });

    const pieces_list = await this.ligneBonChargeRepo.find({
      where: {
        bon: {
          dateEmission: Between(
            moment(startDate).format('YYYY-MM-DD'),
            moment(endDate).format('YYYY-MM-DD'),
          ),
        },
        destinationType: 'Pièce de rechange',
      },
    });

    let ca: number = 0;
    let cash: number = 0;
    let credit: number = 0;
    let check: number = 0;
    let entrees: number = 0;
    let charges: number = 0;
    let cp: number = 0;
    let cnp: number = 0;
    let salaires: number = 0;
    let bank: number = 0;
    let fuel: number = 0;
    let pieces: number = 0;

    // Sum bon paiements
    bons.forEach((bon: Bon) => {
      bon.paiements.forEach((paiement: Paiement) => {
        const montant = parseFloat(paiement.montant.toString());
        ca += montant;
        if (paiement.type === 'cash') {
          cash += montant;
        } else if (paiement.type === 'credit') {
          credit += montant;
        } else if (paiement.type === 'check') {
          check += montant;
        }
      });
    });

    entrees_list.forEach((entree: Entree) => {
      entrees += parseFloat(entree.montant.toString());
    });

    charges_list.forEach((charge: Charge) => {
      const montant = parseFloat(charge.montant.toString());
      charges += montant;
      if (charge.paye) {
        cp += montant;
      } else {
        cnp += montant;
      }
    });

    salaire_list.forEach((salaire: Salaire) => {
      salaires += parseFloat(salaire.amount.toString());
    });

    bank_list.forEach((element: Depot) => {
      bank += parseFloat(element.amount.toString());
    });

    fuel_list.forEach((element: Carburant) => {
      fuel += element.totalPrice;
    });

    pieces_list.forEach((element: LigneBonCharge) => {
      pieces +=
        element.prix * (element.quantite - (element.aVoirQuantity || 0));
    });

    const paiement = await this.paymRepo.find({
      where: {
        bon: bonWhere,
        type: 'credit',
      },
      relations: {
        bon: {
          client: true,
        },
      },
    });

    return {
      ca: Number(ca.toFixed(2)),
      cash: Number(cash.toFixed(2)),
      credit: Number(credit.toFixed(2)),
      entrees: Number(entrees.toFixed(2)),
      charges: Number(charges.toFixed(2)),
      check: Number(check.toFixed(2)),
      cp: Number(cp.toFixed(2)),
      cnp: Number(cnp.toFixed(2)),
      salaires: Number(salaires.toFixed(2)),
      bank: Number(bank.toFixed(2)),
      pieces: Number(pieces.toFixed(2)),
      fuel: Number(fuel.toFixed(2)),
      paiement,
    };
  }

  async getCreditsPerClient() {
    // Implementation for credits per client
  }
}
