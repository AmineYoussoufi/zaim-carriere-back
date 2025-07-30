import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { DevisService } from './devis.service';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  async create(@Body() createDevisDto: any) {
    return await this.devisService.create(createDevisDto);
  }

  @Get('/latest')
  async getLatest() {
    const { numero, annee } = await this.devisService.findLatest();
    if (parseInt(annee) == new Date().getFullYear())
      return parseInt(numero) + 1 + '/' + annee;
    else return 1 + '/' + new Date().getFullYear();
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('numero') numero = '',
    @Query('status') status = '',
  ) {
    return this.devisService.findAll({ page, limit }, numero, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevisDto: any) {
    return this.devisService.update(+id, updateDevisDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.devisService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devisService.remove(+id);
  }

  @Get('client/:clientId')
  getClientDevis(@Param('clientId') clientId: string) {
    return this.devisService.getClientDevis(+clientId);
  }
}
