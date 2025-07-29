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
import { BonChargeService } from './bon-charge.service';
import { CreateBonChargeDto } from './dto/create-bon-charge.dto';

@Controller('bon-charge')
export class BonChargeController {
  constructor(private readonly bonChargeService: BonChargeService) {}

  @Post()
  create(@Body() createBonChargeDto: CreateBonChargeDto) {
    return this.bonChargeService.create(createBonChargeDto);
  }

  @Get('/latest')
  async getLatest() {
    const { numero, annee } = await this.bonChargeService.findLatest();
    if (parseInt(annee) == new Date().getFullYear())
      return parseInt(numero) + 1 + '/' + annee;
    else return 1 + '/' + new Date().getFullYear();
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default to 10 items per page
    @Query('search') query: string = '', // Default to empty search
  ): Promise<{ data: any[]; total: number }> {
    return this.bonChargeService.findAll(page, limit, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonChargeService.findOne(+id);
  }

  @Patch(':id')
  update(@Body() updateBonChargeDto: any) {
    return this.bonChargeService.update(updateBonChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonChargeService.remove(+id);
  }

  @Post('/situation')
  getSituation(@Body() body: any) {
    return this.bonChargeService.getSituation(body);
  }
}
