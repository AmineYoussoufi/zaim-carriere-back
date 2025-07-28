import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Fournisseur } from '../fournisseur/entities/fournisseur.entity';
import { Bon } from 'src/bon/entities/bon.entity';
import { BonCharge } from 'src/bon-charge/entities/bon-charge.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement, Fournisseur, Bon, BonCharge])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
