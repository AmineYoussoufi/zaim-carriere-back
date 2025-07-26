import { Body, Controller, Get, Query } from '@nestjs/common';
import { CaisseService } from './caisse.service';

@Controller('caisse')
export class CaisseController {
  constructor(private readonly caisseService: CaisseService) {}

  @Get('')
  async getCaisse(@Query('date') date) {
    return await this.caisseService.getGeneralCurrent(date);
  }
}
