import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Check } from '../check/entities/check.entity';
import { Lcn } from '../lcn/entities/lcn.entity';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Check)
    private readonly checkRepository: Repository<Check>,
    @InjectRepository(Lcn)
    private readonly lcnRepository: Repository<Lcn>,
  ) {}

  private parseDate(date: string): { startDate: Date; endDate?: Date } {
    const parts = date.split('/');
    let startDate: Date;
    let endDate: Date | undefined;

    if (parts.length === 3) {
      // DD/MM/YYYY
      const [day, month, year] = parts.map(Number);
      startDate = moment([year, month - 1, day]).toDate();
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

  async getUpcomingChecks(date?: string): Promise<any[]> {
    const queryDate = date ? this.parseDate(date).startDate : new Date();
    const startOfPeriod = moment(queryDate)
      .startOf(
        date ? (date.split('/').length === 1 ? 'year' : 'month') : 'month',
      )
      .toDate();

    const checks = await this.checkRepository.find({
      where: {
        date: MoreThanOrEqual(startOfPeriod),
        encaisse: false,
      },
      relations: ['client', 'fournisseur'],
      order: {
        date: 'ASC',
      },
    });

    return checks.map((check: Check) => ({
      id: check.id,
      number: check.checkNumber,
      amount: check.amount,
      date: check.date,
      type: 'check',
      encaisse: check.encaisse,
      client: check.client,
      fournisseur: check.fournisseur,
      createdAt: check.createdAt,
      updatedAt: check.updatedAt,
    }));
  }

  async getUpcomingLCNs(date?: string): Promise<any[]> {
    const queryDate = date ? this.parseDate(date).startDate : new Date();
    const startOfPeriod = moment(queryDate)
      .startOf(
        date ? (date.split('/').length === 1 ? 'year' : 'month') : 'month',
      )
      .toDate();

    const lcns = await this.lcnRepository.find({
      where: {
        date: MoreThanOrEqual(startOfPeriod),
        encaisse: false,
      },
      relations: ['client', 'fournisseur'],
      order: {
        date: 'ASC',
      },
    });

    return lcns.map((lcn: Lcn) => ({
      id: lcn.id,
      number: lcn.checklcnNumber,
      amount: lcn.amount,
      date: lcn.date,
      type: 'lcn',
      encaisse: lcn.encaisse,
      bank: lcn.bank,
      client: lcn.client,
      fournisseur: lcn.fournisseur,
      createdAt: lcn.createdAt,
      updatedAt: lcn.updatedAt,
    }));
  }

  async getUpcomingPayments(date?: string): Promise<any> {
    const [checks, lcns] = await Promise.all([
      this.getUpcomingChecks(date),
      this.getUpcomingLCNs(date),
    ]);
    return { checks, lcns };
  }
}
