import { Module } from '@nestjs/common';
import { BonChargeService } from './bon-charge.service';
import { BonChargeController } from './bon-charge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneBonCharge } from './entities/ligneBonCharge.entity';
import { BonCharge } from './entities/bon-charge.entity';
import { ChargePay } from './entities/chargePay.entity';
import { Destination } from './entities/destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LigneBonCharge,
      BonCharge,
      ChargePay,
      Destination,
    ]),
  ],
  controllers: [BonChargeController],
  providers: [BonChargeService],
})
export class BonChargeModule {}
