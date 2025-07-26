import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateSalaireDto } from './dto/create-salaire.dto';
import { UpdateSalaireDto } from './dto/update-salaire.dto';
import { SalaireService } from './salaire.service';

@Controller('salaire')
export class SalaireController {
  constructor(private readonly salaireService: SalaireService) {}

  @Post()
  create(@Body() createSalaireDto: CreateSalaireDto) {
    return this.salaireService.create(createSalaireDto);
  }

  @Get()
  findAll() {
    return this.salaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaireService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaireDto: UpdateSalaireDto) {
    return this.salaireService.update(+id, updateSalaireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaireService.remove(+id);
  }
}
