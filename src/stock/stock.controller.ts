// src/stock/stock.controller.ts
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
import { StockService } from './stock.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: any) {
    return this.stockService.create(createStockDto);
  }

  @Post('/update-by-name')
  updateByName(@Body() data: any) {
    return this.stockService.getbyNameAndUpdate(data);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.stockService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: any) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }
}
