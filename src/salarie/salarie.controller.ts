import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalarieService } from './salarie.service';
import { CreateSalarieDto } from './dto/create-salarie.dto';
import { UpdateSalarieDto } from './dto/update-salarie.dto';

@Controller('salarie')
export class SalarieController {
  constructor(private readonly salarieService: SalarieService) {}

  @Post()
  create(@Body() createSalarieDto: CreateSalarieDto) {
    return this.salarieService.create(createSalarieDto);
  }

  @Get()
  findAll() {
    return this.salarieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salarieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalarieDto: UpdateSalarieDto) {
    return this.salarieService.update(+id, updateSalarieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salarieService.remove(+id);
  }
}
