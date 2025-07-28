import { Module } from '@nestjs/common';
import { CaisseService } from './caisse.service';
import { CaisseController } from './caisse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from 'src/charge/entities/charge.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';
import { Entree } from 'src/entree/entities/entree.entity';
import { Bon } from 'src/bon/entities/bon.entity';
import { Salaire } from 'src/salaire/entities/salaire.entity';
import { Depot } from 'src/depot/entities/depot.entity';
import { Carburant } from 'src/carburant/entities/carburant.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { LigneBonCharge } from 'src/bon-charge/entities/ligneBonCharge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Charge,
      Paiement,
      Entree,
      Bon,
      Salaire,
      Depot,
      Carburant,
      PieceDeRechange,
      LigneBonCharge,
    ]),
  ],
  controllers: [CaisseController],
  providers: [CaisseService],
})
export class CaisseModule {}
