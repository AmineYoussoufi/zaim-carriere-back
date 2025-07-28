import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Fournisseur } from '../fournisseur/entities/fournisseur.entity';
import { Bon } from '../bon/entities/bon.entity';
import { BonCharge } from '../bon-charge/entities/bon-charge.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';
import * as moment from 'moment';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Paiement)
    private readonly paymentRepository: Repository<Paiement>,
    @InjectRepository(Fournisseur)
    private readonly fournisseurRepository: Repository<Fournisseur>,
    @InjectRepository(Bon)
    private readonly bonRepository: Repository<Bon>,
    @InjectRepository(BonCharge)
    private readonly chargeBonRepository: Repository<BonCharge>,
  ) {}

  async getTotalClientCredits(date?: string): Promise<{ total: number }> {
    const query = this.paymentRepository
      .createQueryBuilder('paiement')
      .select('SUM(paiement.montant)', 'total')
      .where('paiement.type = :type', { type: 'credit' });

    if (date) {
      const startDate = moment(date, 'MM/YYYY').startOf('month').toDate();
      const endDate = moment(date, 'MM/YYYY').endOf('month').toDate();
      query.andWhere('paiement.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();
    return { total: Number(result.total) || 0 };
  }

  async getTotalFournisseurCredits(date?: string): Promise<{ total: number }> {
    // Calculate total paid amounts per bonCharge
    const paidSubQuery = this.chargeBonRepository
      .createQueryBuilder('bc')
      .select('bc.id', 'bonChargeId')
      .addSelect('COALESCE(SUM(cp.montant), 0)', 'totalPaid')
      .leftJoin('bc.paiements', 'cp')
      .groupBy('bc.id');

    // Main query to calculate remaining credits
    const query = this.chargeBonRepository
      .createQueryBuilder('bonCharge')
      .select('SUM(bonCharge.montant - paid.totalPaid)', 'totalCredit')
      .leftJoin(
        `(${paidSubQuery.getQuery()})`,
        'paid',
        'paid.bonChargeId = bonCharge.id',
      )
      .where('bonCharge.montant > COALESCE(paid.totalPaid, 0)');

    if (date) {
      const dateMoment = moment(date, 'MM/YYYY');
      const startDate = dateMoment.startOf('month').format('YYYY-MM-DD');
      const endDate = dateMoment.endOf('month').format('YYYY-MM-DD');

      query.andWhere('bonCharge.dateEmission BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();
    return { total: Number(result.totalCredit) || 0 };
  }

  async getTotalBonsCount(date?: string): Promise<{ total: number }> {
    const query = this.bonRepository.createQueryBuilder('bon');

    if (date) {
      const dateMoment = moment(date, 'MM/YYYY');
      query
        .where('bon.mois = :month', { month: dateMoment.month() + 1 })
        .andWhere('bon.annee = :year', { year: dateMoment.year() });
    }

    const count = await query.getCount();
    return { total: count };
  }

  async getTotalChargeBonsCount(date?: string): Promise<{ total: number }> {
    const where = {};
    if (date) {
      const startDate = moment(date, 'MM/YYYY').startOf('month').toDate();
      const endDate = moment(date, 'MM/YYYY').endOf('month').toDate();
      where['dateEmission'] = Between(startDate, endDate);
    }
    const count = await this.chargeBonRepository.count({ where });
    return { total: count };
  }
}
