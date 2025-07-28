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
import { ILike, Or, Repository } from 'typeorm';

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

  async getGeneralCurrent(date: string) {
    const splitDate = date.split('/');
    const where: any = {
      mois: splitDate[0],
      annee: splitDate[1],
    };

    const bons = await this.bonRepo.find({
      relations: {
        paiements: true,
      },
      where,
      select: ['paiements'],
    });

    const entrees_list = await this.inRepo.find({
      where: {
        date: ILike(`%${date}`),
      },
    });

    const charges_list = await this.outRepo.find({
      where: {
        date: ILike(`%${date}`),
      },
    });

    const salaire_list = await this.payRepo.find({
      where: {
        date: Or(ILike(`%${date}`), ILike(`${splitDate[1]}-${splitDate[0]}%`)),
      },
    });

    const bank_list = await this.bankRepo.find({
      where: {
        date: Or(ILike(`%${date}`), ILike(`${splitDate[1]}-${splitDate[0]}%`)),
      },
    });

    const fuel_list = await this.fuelRepo.find({
      where: {
        date: Or(ILike(`%${date}`), ILike(`${splitDate[1]}-${splitDate[0]}%`)),
      },
    });

    const pieces_list = await this.ligneBonChargeRepo.find({
      where: {
        bon: {
          dateEmission: Or(
            ILike(`%${date}`),
            ILike(`${splitDate[1]}-${splitDate[0]}%`),
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

    // Sum bon paiements – converting montant to float
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
        bon: where,
        type: 'credit',
      },
      relations: {
        bon: {
          client: true,
        },
      },
    });

    // Optionally, format each total to two decimals:
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
      paiement, // This remains as returned from the repository
    };
  }

  async getCreditsPerClient() {}
}
