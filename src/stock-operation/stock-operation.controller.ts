import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StockOperationService } from './stock-operation.service';
import { CreateStockOperationDto } from './dto/create-stock-operation.dto';
import { UpdateStockOperationDto } from './dto/update-stock-operation.dto';

@Controller('stock-operation')
export class StockOperationController {
  constructor(private readonly stockOperationService: StockOperationService) {}

  @Post()
  create(@Body() createStockOperationDto: CreateStockOperationDto) {
    return this.stockOperationService.create(createStockOperationDto);
  }

  @Get()
  findAll() {
    return this.stockOperationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockOperationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockOperationDto: UpdateStockOperationDto,
  ) {
    return this.stockOperationService.update(+id, updateStockOperationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockOperationService.remove(+id);
  }
}
