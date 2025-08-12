import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AchatTypesService } from './achat-type.service';

@Controller('achat-types')
export class AchatTypesController {
  constructor(private readonly achatTypesService: AchatTypesService) {}

  @Post()
  create(@Body() createAchatTypeDto: any) {
    return this.achatTypesService.create(createAchatTypeDto);
  }

  @Get()
  findAll() {
    return this.achatTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achatTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAchatTypeDto: any) {
    return this.achatTypesService.update(+id, updateAchatTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achatTypesService.remove(+id);
  }
}
