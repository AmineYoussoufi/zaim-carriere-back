import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('credits/total')
  async getTotalClientCredits(@Query('date') date?: string) {
    return this.reportsService.getTotalClientCredits(date);
  }

  @Get('fournisseurs/credits/total')
  async getTotalFournisseurCredits(@Query('date') date?: string) {
    return this.reportsService.getTotalFournisseurCredits(date);
  }

  @Get('bons/count')
  async getTotalBonsCount(@Query('date') date?: string) {
    return this.reportsService.getTotalBonsCount(date);
  }

  @Get('charge-bons/count')
  async getTotalChargeBonsCount(@Query('date') date?: string) {
    return this.reportsService.getTotalChargeBonsCount(date);
  }

  @Get('caisse')
  async getRapportCaisse(@Query('date') date?: string) {
    return this.reportsService.getRapportCaisse(date);
  }
  @Get('vehicules')
  async getRapportVehicules(@Query('date') date?: string) {
    return this.reportsService.getVehiculesStats(date);
  }
  @Get('production')
  async getRapportProduction(@Query('date') date?: string) {
    return this.reportsService.getProductionStats(date);
  }
}
