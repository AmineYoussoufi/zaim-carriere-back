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
import { BonService } from './bon.service';
import { UpdateBonDto } from './dto/update-bon.dto';

@Controller('bon')
export class BonController {
  constructor(private readonly bonService: BonService) {}

  @Post()
  async create(@Body() createBonDto: any) {
    return await this.bonService.create(createBonDto);
  }

  @Get('/latest')
  async getLatest() {
    const { numero, annee } = await this.bonService.findLatest();
    if (parseInt(annee) == new Date().getFullYear())
      return parseInt(numero) + 1 + '/' + annee;
    else return 1 + '/' + new Date().getFullYear();
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('numero') numero = '',
  ) {
    return this.bonService.findAll({ page, limit }, numero);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBonDto: UpdateBonDto) {
    return this.bonService.update(+id, updateBonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonService.remove(+id);
  }

  @Post('/situation')
  getSituation(@Body() body: any) {
    return this.bonService.getSituation(body);
  }

  @Post('/update-montants')
  async updateMontants() {
    return await this.bonService.bulkUpdateAllBonsMontant();
  }
}
