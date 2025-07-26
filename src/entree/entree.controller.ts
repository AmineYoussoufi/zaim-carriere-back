import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EntreeService } from './entree.service';
import { CreateEntreeDto } from './dto/create-entree.dto';
import { UpdateEntreeDto } from './dto/update-entree.dto';

@Controller('entree')
export class EntreeController {
  constructor(private readonly entreeService: EntreeService) {}

  @Post()
  create(@Body() createEntreeDto: CreateEntreeDto) {
    return this.entreeService.create(createEntreeDto);
  }

  @Get()
  findAll() {
    return this.entreeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entreeService.findOne(+id);
  }

  @Get('by-client/:id')
  findByClient(@Param('id') id: string) {
    return this.entreeService.findByClient(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntreeDto: UpdateEntreeDto) {
    return this.entreeService.update(+id, updateEntreeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entreeService.remove(+id);
  }
}
