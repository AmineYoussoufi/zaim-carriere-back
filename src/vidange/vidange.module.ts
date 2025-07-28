// src/vidange/vidange.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VidangeService } from './vidange.service';
import { VidangeController } from './vidange.controller';
import { Vidange } from './entities/vidange.entity';
import { VehiculeModule } from '../vehicule/vehicule.module';
import { MachineModule } from '../machine/machine.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vidange]), VehiculeModule, MachineModule],
  controllers: [VidangeController],
  providers: [VidangeService],
  exports: [VidangeService],
})
export class VidangeModule {}
