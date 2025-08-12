import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Fournisseur } from '../fournisseur/entities/fournisseur.entity';
import { Bon } from '../bon/entities/bon.entity';
import { BonCharge } from '../bon-charge/entities/bon-charge.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';
import * as moment from 'moment';
import { Entree } from 'src/entree/entities/entree.entity';
import { Salarie } from 'src/salarie/entities/salarie.entity';
import { Carburant } from 'src/carburant/entities/carburant.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { Vidange } from 'src/vidange/entities/vidange.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Production } from 'src/production/entities/production.entity';
import { Machine } from 'src/machine/entities/machine.entity';

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
    @InjectRepository(Entree)
    private readonly entreeRepository: Repository<Entree>,
    @InjectRepository(Salarie)
    private readonly salarieRepository: Repository<Salarie>,
    @InjectRepository(Carburant)
    private readonly carburantRepository: Repository<Carburant>,
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(PieceDeRechange)
    private readonly pieceDeRechangeRepository: Repository<PieceDeRechange>,
    @InjectRepository(Vidange)
    private readonly vidangeRepository: Repository<Vidange>,
    @InjectRepository(Charge)
    private readonly chargeRepository: Repository<Charge>,
    @InjectRepository(Production)
    private readonly productionRepository: Repository<Production>,
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
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

    const entree = this.entreeRepository
      .createQueryBuilder('entree')
      .select('SUM(entree.montant)', 'total');

    if (date) {
      const { startDate, endDate } = this.parseDate(date);
      query.andWhere('paiement.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
      entree.andWhere('entree.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();
    const entreeResult = await entree.getRawOne();
    const totalEntree = Number(entreeResult?.total) || 0;
    return { total: Number(result.total - totalEntree) || 0 };
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

    const chargeQuery = this.chargeRepository
      .createQueryBuilder('charge')
      .select('SUM(charge.montant)', 'totalCharge')
      .where('charge.paye = :paye', { paye: true });

    if (date) {
      const { startDate, endDate } = this.parseDate(date);
      query.andWhere('bonCharge.dateEmission BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
      chargeQuery.andWhere('charge.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const result = await query.getRawOne();
    const chargeResult = await chargeQuery.getRawOne();
    return {
      total: Number(result.totalCredit - chargeResult.totalCharge) || 0,
    };
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

  async getRapportCaisse(date?: string): Promise<any> {
    // Determine date range
    let startDate: Date, endDate: Date;
    if (date) {
      const parsedDates = this.parseDate(date);
      startDate = parsedDates.startDate;
      endDate = parsedDates.endDate;
    } else {
      // Default to current year if no date specified
      const year = new Date().getFullYear();
      startDate = moment([year]).startOf('year').toDate();
      endDate = moment([year]).endOf('year').toDate();
    }

    // Get all months in the date range
    const months: { year: number; month: number }[] = [];
    let currentDate = moment(startDate);
    while (currentDate.isBefore(endDate)) {
      months.push({
        year: currentDate.year(),
        month: currentDate.month() + 1, // months are 1-based
      });
      currentDate = currentDate.add(1, 'month');
    }

    // Process each month
    const rapport = await Promise.all(
      months.map(async ({ year, month }) => {
        const monthStart = moment([year, month - 1])
          .startOf('month')
          .toDate();
        const monthEnd = moment([year, month - 1])
          .endOf('month')
          .toDate();

        // 1. Chiffre d'affaires (total montant from bons)
        const caQuery = this.bonRepository
          .createQueryBuilder('bon')
          .select('COALESCE(SUM(bon.montant), 0)', 'total')
          .where('bon.mois = :month', { month })
          .andWhere('bon.annee = :year', { year });
        const caResult = await caQuery.getRawOne();
        const chiffreAffaires = Number(caResult?.total) || 0;

        // 2. Entrées (from Entree entity)
        const entreesQuery = this.entreeRepository
          .createQueryBuilder('entree')
          .select('COALESCE(SUM(entree.montant), 0)', 'total')
          .where('YEAR(STR_TO_DATE(entree.date, "%d/%m/%Y")) = :year', { year })
          .andWhere('MONTH(STR_TO_DATE(entree.date, "%d/%m/%Y")) = :month', {
            month,
          });
        const entreesResult = await entreesQuery.getRawOne();
        const entrees = Number(entreesResult?.total) || 0;

        // 3. Charges (total from charge bons)
        const chargesQuery = this.chargeBonRepository
          .createQueryBuilder('bonCharge')
          .select('COALESCE(SUM(bonCharge.montant), 0)', 'total')
          .where('bonCharge.dateEmission BETWEEN :start AND :end', {
            start: monthStart,
            end: monthEnd,
          });
        const chargesResult = await chargesQuery.getRawOne();
        const charges = Number(chargesResult?.total) || 0;

        // 4. Crédits (client credits)
        const creditsQuery = this.paymentRepository
          .createQueryBuilder('paiement')
          .select('COALESCE(SUM(paiement.montant), 0)', 'total')
          .leftJoin('paiement.bon', 'bon')
          .where('paiement.type = :type', { type: 'credit' })
          .andWhere('bon.mois = :month', { month })
          .andWhere('bon.annee = :year', { year });
        const creditsResult = await creditsQuery.getRawOne();
        const credits = Number(creditsResult?.total) || 0;

        // 5. Paiements (all payments except credits)
        const paiementsQuery = this.paymentRepository
          .createQueryBuilder('paiement')
          .select('COALESCE(SUM(paiement.montant), 0)', 'total')
          .leftJoin('paiement.bon', 'bon')
          .where('paiement.type != :type', { type: 'credit' })
          .andWhere('bon.mois = :month', { month })
          .andWhere('bon.annee = :year', { year });
        const paiementsResult = await paiementsQuery.getRawOne();
        const paiements = Number(paiementsResult?.total) || 0;

        // 6. Total Salaries hired before or during this month
        const salariesQuery = this.salarieRepository
          .createQueryBuilder('salarie')
          .select('COALESCE(SUM(salarie.salaire), 0)', 'total')
          .where('STR_TO_DATE(salarie.date, "%d/%m/%Y") <= :endDate', {
            endDate: monthEnd,
          });
        const salariesResult = await salariesQuery.getRawOne();
        const salaires = Number(salariesResult?.total) || 0;

        // 7. Total Carburant for this month
        const carburantQuery = this.carburantRepository
          .createQueryBuilder('carburant')
          .select('SUM(carburant.liters * carburant.unitPrice)', 'total')
          .where('YEAR(carburant.date) = :year', {
            year: year,
          })
          .andWhere('MONTH(carburant.date) = :month', {
            month: month,
          });
        const carburantResult = await carburantQuery.getRawOne();
        const carburant = Number(carburantResult?.total) || 0;

        return {
          month: `${month.toString().padStart(2, '0')}/${year}`,
          chiffreAffaires,
          entrees,
          charges,
          credits,
          paiements,
          salaires,
          carburant,
        };
      }),
    );

    return rapport;
  }

  async getVehiculesStats(date?: string): Promise<any[]> {
    // Parse date filter if provided
    let yearFilter: number | undefined;
    let monthFilter: number | undefined;

    if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        // DD/MM/YYYY format - we'll use MM/YYYY
        monthFilter = parseInt(parts[1]);
        yearFilter = parseInt(parts[2]);
      } else if (parts.length === 2) {
        // MM/YYYY format
        monthFilter = parseInt(parts[0]);
        yearFilter = parseInt(parts[1]);
      } else if (parts.length === 1) {
        // YYYY format
        yearFilter = parseInt(parts[0]);
      }
    }

    // Get all vehicles with their relations
    const vehicules = await this.vehiculeRepository.find({
      where: {
        type: 'Local',
      },
      relations: ['chauffeur'],
    });

    // Process each vehicle
    const stats = await Promise.all(
      vehicules.map(async (vehicule) => {
        // 1. Count trips (bons) and sum transport amounts for this vehicle
        const tripsQuery = this.bonRepository
          .createQueryBuilder('bon')
          .select('COUNT(bon.id)', 'count')
          .addSelect('SUM(bon.transport)', 'totalTransport')
          .where('bon.vehiculeId = :vehiculeId', { vehiculeId: vehicule.id });

        if (yearFilter) {
          tripsQuery.andWhere('bon.annee = :year', { year: yearFilter });
        }
        if (monthFilter) {
          tripsQuery.andWhere('bon.mois = :month', { month: monthFilter });
        }

        const tripsResult = await tripsQuery.getRawOne();

        // 2. Calculate fuel consumption and cost from carburant
        const carburantStats = await this.carburantRepository
          .createQueryBuilder('carburant')
          .select('SUM(carburant.liters)', 'totalLiters')
          .addSelect('SUM(carburant.liters * carburant.unitPrice)', 'totalCost')
          .where('carburant.vehicule = :vehiculeId', {
            vehiculeId: vehicule.id,
          });

        if (yearFilter) {
          carburantStats.andWhere('YEAR(carburant.date) = :year', {
            year: yearFilter,
          });
        }
        if (monthFilter) {
          carburantStats.andWhere('MONTH(carburant.date) = :month', {
            month: monthFilter,
          });
        }

        const carburantResult = await carburantStats.getRawOne();

        // 3. Calculate oil changes count and cost from vidanges
        const vidangesQuery = this.vidangeRepository
          .createQueryBuilder('vidange')
          .select('COUNT(vidange.id)', 'count')
          .addSelect('SUM(vidange.cout)', 'totalCost')
          .where('vidange.vehicule = :vehiculeId', { vehiculeId: vehicule.id });

        if (yearFilter) {
          vidangesQuery.andWhere('YEAR(vidange.date) = :year', {
            year: yearFilter,
          });
        }
        if (monthFilter) {
          vidangesQuery.andWhere('MONTH(vidange.date) = :month', {
            month: monthFilter,
          });
        }

        const vidangesResult = await vidangesQuery.getRawOne();

        // 4. Calculate spare parts count
        const piecesQuery = this.pieceDeRechangeRepository
          .createQueryBuilder('piece')
          .select('COUNT(piece.id)', 'count')
          .where('piece.vehicule = :vehiculeId', { vehiculeId: vehicule.id });

        if (yearFilter) {
          piecesQuery.andWhere('YEAR(piece.date) = :year', {
            year: yearFilter,
          });
        }
        if (monthFilter) {
          piecesQuery.andWhere('MONTH(piece.date) = :month', {
            month: monthFilter,
          });
        }

        const piecesResult = await piecesQuery.getRawOne();

        return {
          id: vehicule.id,
          matricule: vehicule.immatricule,
          marque: vehicule.marque || 'N/A',
          modele: vehicule.modele || 'N/A',
          chauffeur: vehicule.chauffeur?.name || 'Non affecté',
          periode: monthFilter
            ? `${monthFilter.toString().padStart(2, '0')}/${yearFilter}`
            : yearFilter?.toString() || 'Tous',
          totalVoyages: parseInt(tripsResult?.count) || 0,
          totalTransport: parseFloat(tripsResult?.totalTransport) || 0,
          totalCarburant: parseFloat(carburantResult?.totalLiters) || 0,
          coutCarburant: parseFloat(carburantResult?.totalCost) || 0,
          nombreVidanges: parseInt(vidangesResult?.count) || 0,
          coutVidanges: parseFloat(vidangesResult?.totalCost) || 0,
          nombrePieces: parseInt(piecesResult?.count) || 0,
        };
      }),
    );

    return stats;
  }

  async getProductionStats(date?: string, machineId?: number): Promise<any> {
    // Parse date filter if provided
    let startDate: Date, endDate: Date;
    if (date) {
      const parsedDates = this.parseDate(date);
      startDate = parsedDates.startDate;
      endDate = parsedDates.endDate;
    } else {
      // Default to current month if no date specified
      const now = new Date();
      startDate = moment(now).startOf('month').toDate();
      endDate = moment(now).endOf('month').toDate();
    }

    // Base query with relations
    const query = this.productionRepository
      .createQueryBuilder('production')
      .leftJoinAndSelect('production.machine', 'machine')
      .leftJoinAndSelect('production.produit', 'produit')
      .where('production.startDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });

    // Apply machine filter if provided
    if (machineId) {
      query.andWhere('production.machineId = :machineId', { machineId });
    }

    // 1. Get total production quantity by product
    const productionByProduct = await query
      .clone()
      .select('produit.name', 'productName')
      .addSelect('produit.id', 'productId')
      .addSelect('SUM(production.quantity)', 'totalQuantity')
      .groupBy('produit.name, produit.id')
      .getRawMany();

    // 2. Get production by machine
    const productionByMachine = await query
      .clone()
      .select('machine.name', 'machineName')
      .addSelect('machine.id', 'machineId')
      .addSelect('COUNT(production.id)', 'productionCount')
      .addSelect('SUM(production.quantity)', 'totalQuantity')
      .groupBy('machine.name, machine.id')
      .getRawMany();

    // 3. Get production by status
    const productionByStatus = await query
      .clone()
      .select('production.status', 'status')
      .addSelect('COUNT(production.id)', 'count')
      .groupBy('production.status')
      .getRawMany();

    // 4. Get total completed production quantity
    const totalCompleted = await query
      .clone()
      .select('SUM(production.quantity)', 'total')
      .andWhere('production.status = :status', { status: 'completed' })
      .getRawOne();

    // 5. Get production timeline (daily completed quantities)
    const productionTimeline = await query
      .clone()
      .select('DATE(production.endDate)', 'day')
      .addSelect('SUM(production.quantity)', 'quantity')
      .andWhere('production.status = :status', { status: 'completed' })
      .groupBy('DATE(production.endDate)')
      .orderBy('DATE(production.endDate)')
      .getRawMany();

    // 6. Get average production per machine
    const avgProductionPerMachine = await query
      .clone()
      .select('AVG(daily.quantity)', 'avg')
      .from(
        (qb) =>
          qb
            .select('machine.id', 'machineId')
            .addSelect('DATE(production.endDate)', 'day')
            .addSelect('SUM(production.quantity)', 'quantity')
            .from(Production, 'production')
            .leftJoin('production.machine', 'machine')
            .where('production.startDate BETWEEN :start AND :end', {
              start: startDate,
              end: endDate,
            })
            .andWhere('production.status = :status', { status: 'completed' })
            .groupBy('machine.id, DATE(production.endDate)'),
        'daily',
      )
      .getRawOne();

    // 7. Get machine utilization (hours used vs available)
    const machineUtilization = await this.getMachineUtilization(
      startDate,
      endDate,
      machineId,
    );

    return {
      period: date || `${moment(startDate).format('MM/YYYY')}`,
      totalCompleted: Number(totalCompleted?.total) || 0,
      byProduct: productionByProduct,
      byMachine: productionByMachine,
      byStatus: productionByStatus,
      timeline: productionTimeline.map((item) => ({
        day: moment(item.day).format('YYYY-MM-DD'),
        quantity: Number(item.quantity),
      })),
      efficiency: await this.calculateProductionEfficiency(startDate, endDate),
      avgProductionPerMachine: Number(avgProductionPerMachine?.avg) || 0,
      machineUtilization,
      filteredMachineId: machineId || null,
    };
  }

  private async calculateProductionEfficiency(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    // Calculate theoretical maximum production time
    const daysBetween = moment(endDate).diff(moment(startDate), 'days') + 1;
    const maxHours = daysBetween * 24; // Assuming machines could run 24/7

    // Calculate actual production time
    const actualProductionTime = await this.productionRepository
      .createQueryBuilder('production')
      .select(
        'SUM(TIMESTAMPDIFF(HOUR, production.startDate, production.endDate))',
        'totalHours',
      )
      .where('production.startDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .andWhere('production.status = :status', { status: 'completed' })
      .getRawOne();

    const actualHours = Number(actualProductionTime?.totalHours) || 0;

    // Calculate efficiency percentage (actual/max * 100)
    return maxHours > 0 ? Math.round((actualHours / maxHours) * 100) : 0;
  }

  private async getMachineUtilization(
    startDate: Date,
    endDate: Date,
    machineId?: number,
  ): Promise<any[]> {
    // Get all machines or specific machine
    const machineQuery = this.machineRepository.createQueryBuilder('machine');
    if (machineId) {
      machineQuery.where('machine.id = :machineId', { machineId });
    }

    const machines = await machineQuery.getMany();

    // Calculate utilization for each machine
    return Promise.all(
      machines.map(async (machine) => {
        // Get total hours this machine was in use
        const usage = await this.productionRepository
          .createQueryBuilder('production')
          .select(
            'SUM(TIMESTAMPDIFF(HOUR, production.startDate, production.endDate))',
            'hoursUsed',
          )
          .where('production.machineId = :machineId', { machineId: machine.id })
          .andWhere('production.startDate BETWEEN :start AND :end', {
            start: startDate,
            end: endDate,
          })
          .andWhere('production.status = :status', { status: 'completed' })
          .getRawOne();

        const hoursUsed = Number(usage?.hoursUsed) || 0;

        // Calculate total available hours in period
        const daysBetween = moment(endDate).diff(moment(startDate), 'days') + 1;
        const hoursAvailable = daysBetween * 24; // Assuming 24/7 availability

        return {
          machineId: machine.id,
          machineName: machine.name,
          hoursUsed,
          hoursAvailable,
          utilizationRate:
            hoursAvailable > 0
              ? Math.round((hoursUsed / hoursAvailable) * 100)
              : 0,
          products: await this.getMachineProducts(machine.id),
        };
      }),
    );
  }

  private async getMachineProducts(machineId: number): Promise<any[]> {
    return this.productionRepository
      .createQueryBuilder('production')
      .select('produit.name', 'productName')
      .addSelect('produit.id', 'productId')
      .addSelect('SUM(production.quantity)', 'totalProduced')
      .leftJoin('production.produit', 'produit')
      .where('production.machineId = :machineId', { machineId })
      .andWhere('production.status = :status', { status: 'completed' })
      .groupBy('produit.name, produit.id')
      .orderBy('SUM(production.quantity)', 'DESC')
      .getRawMany();
  }
}
