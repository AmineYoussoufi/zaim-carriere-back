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

  async getUpcomingChecks(date?: string): Promise<any[]> {
    const queryDate = date ? moment(date, 'MM/YYYY').toDate() : new Date();
    const startOfMonth = moment(queryDate).startOf('month').toDate();

    const checks = await this.checkRepository.find({
      where: {
        date: MoreThanOrEqual(startOfMonth),
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
    const queryDate = date ? moment(date, 'MM/YYYY').toDate() : new Date();
    const startOfMonth = moment(queryDate).startOf('month').toDate();

    const lcns = await this.lcnRepository.find({
      where: {
        date: MoreThanOrEqual(startOfMonth),
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
