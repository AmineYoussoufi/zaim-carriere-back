import { Module } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Charge } from './entities/charge.entity';

@Module({
  controllers: [ChargeController],
  providers: [ChargeService],
  imports: [TypeOrmModule.forFeature([Charge])],
})
export class ChargeModule {}
