import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MachineTypesService } from './machine-type.service';

@Controller('machine-types')
export class MachineTypesController {
  constructor(private readonly machineTypesService: MachineTypesService) {}

  @Post()
  create(@Body() createMachineTypeDto: any) {
    return this.machineTypesService.create(createMachineTypeDto);
  }

  @Get()
  findAll() {
    return this.machineTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machineTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMachineTypeDto: any) {
    return this.machineTypesService.update(+id, updateMachineTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machineTypesService.remove(+id);
  }
}
