import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Fournisseur } from '../fournisseur/entities/fournisseur.entity';
import { Bon } from 'src/bon/entities/bon.entity';
import { BonCharge } from 'src/bon-charge/entities/bon-charge.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';
import { Entree } from 'src/entree/entities/entree.entity';
import { Salarie } from 'src/salarie/entities/salarie.entity';
import { Carburant } from 'src/carburant/entities/carburant.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { Vidange } from 'src/vidange/entities/vidange.entity';
import { Charge } from 'src/charge/entities/charge.entity';
import { Production } from 'src/production/entities/production.entity';
import { Machine } from 'src/machine/entities/machine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Paiement,
      Fournisseur,
      Bon,
      BonCharge,
      Entree,
      Salarie,
      Carburant,
      Vehicule,
      PieceDeRechange,
      Vidange,
      Charge,
      Production,
      Machine,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
