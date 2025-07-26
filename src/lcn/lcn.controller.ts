import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LcnService } from './lcn.service';

@Controller('lcns')
export class LcnController {
  constructor(private readonly lcnService: LcnService) {}

  @Post()
  create(@Body() lcnData: any) {
    return this.lcnService.create(lcnData);
  }

  @Get()
  findAll() {
    return this.lcnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lcnService.findOne(+id);
  }

  @Get('by-number/:checklcnNumber')
  findByNumber(@Param('checklcnNumber') checklcnNumber: string) {
    return this.lcnService.findByChecklcnNumber(checklcnNumber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.lcnService.update(+id, updateData);
  }

  @Patch(':id/mark-encaisse')
  markAsEncaisse(@Param('id') id: string) {
    return this.lcnService.markAsEncaisse(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lcnService.remove(+id);
  }

  @Get('client/:clientId')
  getByClient(@Param('clientId') clientId: string) {
    return this.lcnService.getLcnsByClient(+clientId);
  }

  @Get('fournisseur/:fournisseurId')
  getByFournisseur(@Param('fournisseurId') fournisseurId: string) {
    return this.lcnService.getLcnsByFournisseur(+fournisseurId);
  }

  @Get('client/:clientId/total')
  getClientTotal(@Param('clientId') clientId: string) {
    return this.lcnService.getTotalAmountByClient(+clientId);
  }

  @Get('fournisseur/:fournisseurId/total')
  getFournisseurTotal(@Param('fournisseurId') fournisseurId: string) {
    return this.lcnService.getTotalAmountByFournisseur(+fournisseurId);
  }
}
