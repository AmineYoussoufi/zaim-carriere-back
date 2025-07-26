import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarburantService } from './carburant.service';
import { CreateCarburantDto } from './dto/create-carburant.dto';
import { UpdateCarburantDto } from './dto/update-carburant.dto';

@Controller('carburant')
export class CarburantController {
  constructor(private readonly carburantService: CarburantService) {}

  @Post()
  create(@Body() createCarburantDto: CreateCarburantDto) {
    return this.carburantService.create(createCarburantDto);
  }

  @Get()
  findAll() {
    return this.carburantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carburantService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarburantDto: UpdateCarburantDto,
  ) {
    return this.carburantService.update(+id, updateCarburantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carburantService.remove(+id);
  }
}
