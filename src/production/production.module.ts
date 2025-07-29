// src/production/production.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { Production } from './entities/production.entity';
import { Machine } from '../machine/entities/machine.entity';
import { Produit } from 'src/produit/entities/produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Production, Machine, Produit])],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService], // Export if needed by other modules
})
export class ProductionModule {}
