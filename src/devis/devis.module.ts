import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneDevis } from './entities/ligneDevis.entity';
import { Devis } from './entities/devis.entity';

@Module({
  controllers: [DevisController],
  providers: [DevisService],
  imports: [TypeOrmModule.forFeature([Devis, LigneDevis])],
})
export class DevisModule {}
