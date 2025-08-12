import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineType } from './entities/machine-type.entity';
import { MachineTypesController } from './machine-type.controller';
import { MachineTypesService } from './machine-type.service';

@Module({
  controllers: [MachineTypesController],
  providers: [MachineTypesService],
  imports: [TypeOrmModule.forFeature([MachineType])],
})
export class MachineTypeModule {}
