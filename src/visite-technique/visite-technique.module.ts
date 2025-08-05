// src/visite-technique/visite-technique.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisiteTechniqueService } from './visite-technique.service';
import { VisiteTechniqueController } from './visite-technique.controller';
import { VisiteTechnique } from './entities/visite-technique.entity';
import { VehiculeModule } from '../vehicule/vehicule.module';

@Module({
  imports: [TypeOrmModule.forFeature([VisiteTechnique]), VehiculeModule],
  controllers: [VisiteTechniqueController],
  providers: [VisiteTechniqueService],
  exports: [VisiteTechniqueService],
})
export class VisiteTechniqueModule {}
