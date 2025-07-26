import { Module } from '@nestjs/common';
import { BonService } from './bon.service';
import { BonController } from './bon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bon } from './entities/bon.entity';
import { LigneBon } from './entities/ligneBon.entity';
import { Paiement } from './entities/paiement.entity';

@Module({
  controllers: [BonController],
  providers: [BonService],
  imports: [TypeOrmModule.forFeature([Bon, LigneBon, Paiement])],
})
export class BonModule {}
