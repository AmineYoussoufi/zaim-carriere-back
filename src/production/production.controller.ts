// src/production/production.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductionService } from './production.service';

@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post()
  create(@Body() createProductionDto: any) {
    return this.productionService.create(createProductionDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.productionService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionDto: any) {
    return this.productionService.update(+id, updateProductionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionService.remove(+id);
  }

  @Get('stats/summary')
  getStats() {
    return this.productionService.getProductionStats();
  }
}
