import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { Check } from './entities/check.entity';

@Controller('checks')
export class CheckController {
  constructor(private readonly checksService: CheckService) {}

  @Get()
  async findAll(): Promise<Check[]> {
    return this.checksService.getList();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Check> {
    return this.checksService.getById(id);
  }

  @Post()
  async create(@Body() data: Partial<Check>): Promise<Check> {
    return this.checksService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Check>,
  ): Promise<Check> {
    return this.checksService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.checksService.remove(id);
  }
}
