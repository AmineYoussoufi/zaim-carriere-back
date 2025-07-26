import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PieceDeRechangeService } from './piece-de-rechange.service';
import { CreatePieceDeRechangeDto } from './dto/create-piece-de-rechange.dto';
import { UpdatePieceDeRechangeDto } from './dto/update-piece-de-rechange.dto';

@Controller('piece-de-rechange')
export class PieceDeRechangeController {
  constructor(
    private readonly pieceDeRechangeService: PieceDeRechangeService,
  ) {}

  @Post()
  create(@Body() createPieceDeRechangeDto: CreatePieceDeRechangeDto) {
    return this.pieceDeRechangeService.create(createPieceDeRechangeDto);
  }

  @Get()
  findAll() {
    return this.pieceDeRechangeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pieceDeRechangeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePieceDeRechangeDto: UpdatePieceDeRechangeDto,
  ) {
    return this.pieceDeRechangeService.update(+id, updatePieceDeRechangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pieceDeRechangeService.remove(+id);
  }
}
