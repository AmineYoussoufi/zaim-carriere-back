// src/vidange/vidange.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VidangeService } from './vidange.service';

@Controller('vidanges')
export class VidangeController {
  constructor(private readonly vidangeService: VidangeService) {}

  @Post()
  create(@Body() createVidangeDto: any) {
    return this.vidangeService.create(createVidangeDto);
  }

  @Get()
  findAll() {
    return this.vidangeService.findAll();
  }

  @Get('vehicule/:vehiculeId')
  findByVehicule(@Param('vehiculeId') vehiculeId: string) {
    return this.vidangeService.findByVehicule(+vehiculeId);
  }

  @Get('machine/:machineId')
  findByMachine(@Param('machineId') machineId: string) {
    return this.vidangeService.findByMachine(+machineId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vidangeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVidangeDto: any) {
    return this.vidangeService.update(+id, updateVidangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vidangeService.remove(+id);
  }
}
