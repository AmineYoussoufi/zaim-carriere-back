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

  private parseDate(date: string): { startDate: Date; endDate: Date } {
    const parts = date.split('/');
    let startDate: Date;
    let endDate: Date;

    if (parts.length === 3) {
      // DD/MM/YYYY
      const [day, month, year] = parts.map(Number);
      startDate = moment([year, month - 1, day])
        .startOf('day')
        .toDate();
      endDate = moment([year, month - 1, day])
        .endOf('day')
        .toDate();
    } else if (parts.length === 2) {
      // MM/YYYY
      const [month, year] = parts.map(Number);
      startDate = moment([year, month - 1])
        .startOf('month')
        .toDate();
      endDate = moment([year, month - 1])
        .endOf('month')
        .toDate();
    } else if (parts.length === 1) {
      // YYYY
      const year = Number(parts[0]);
      startDate = moment([year]).startOf('year').toDate();
      endDate = moment([year]).endOf('year').toDate();
    } else {
      throw new Error('Invalid date format. Use DD/MM/YYYY, MM/YYYY, or YYYY');
    }

    return { startDate, endDate };
  }

  async getTotalClientCredits(date?: string): Promise<{ total: number }> {
    const query = this.paymentRepository
      .createQueryBuilder('paiement')
      .select('SUM(paiement.montant)', 'total')
      .where('paiement.type = :type', { type: 'credit' });

    if (date) {
      const { startDate, endDate } = this.parseDate(date);
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
      const { startDate, endDate } = this.parseDate(date);
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
      const parts = date.split('/');
      if (parts.length === 3) {
        // DD/MM/YYYY
        const [day, month, year] = parts.map(Number);
        query
          .where('bon.jour = :day', { day })
          .andWhere('bon.mois = :month', { month })
          .andWhere('bon.annee = :year', { year });
      } else if (parts.length === 2) {
        // MM/YYYY
        const [month, year] = parts.map(Number);
        query
          .where('bon.mois = :month', { month })
          .andWhere('bon.annee = :year', { year });
      } else if (parts.length === 1) {
        // YYYY
        const year = Number(parts[0]);
        query.where('bon.annee = :year', { year });
      }
    }

    const count = await query.getCount();
    return { total: count };
  }

  async getTotalChargeBonsCount(date?: string): Promise<{ total: number }> {
    const where = {};
    if (date) {
      const { startDate, endDate } = this.parseDate(date);
      where['dateEmission'] = Between(startDate, endDate);
    }
    const count = await this.chargeBonRepository.count({ where });
    return { total: count };
  }
}
