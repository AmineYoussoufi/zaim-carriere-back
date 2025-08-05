// src/visite-technique/visite-technique.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VisiteTechniqueService } from './visite-technique.service';

@Controller('vehicules/:vehiculeId/visites-techniques')
export class VisiteTechniqueController {
  constructor(
    private readonly visiteTechniqueService: VisiteTechniqueService,
  ) {}

  @Post()
  create(
    @Param('vehiculeId', ParseIntPipe) vehiculeId: number,
    @Body() createVisiteTechniqueDto: any,
  ) {
    return this.visiteTechniqueService.create(
      vehiculeId,
      createVisiteTechniqueDto,
    );
  }

  @Get()
  findAllByVehicule(@Param('vehiculeId', ParseIntPipe) vehiculeId: number) {
    return this.visiteTechniqueService.findAllByVehicule(vehiculeId);
  }

  @Get(':id')
  findOne(
    @Param('vehiculeId', ParseIntPipe) vehiculeId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.visiteTechniqueService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVisiteTechniqueDto: any,
  ) {
    return this.visiteTechniqueService.update(id, updateVisiteTechniqueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.visiteTechniqueService.remove(id);
  }
}
