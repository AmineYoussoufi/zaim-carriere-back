import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Check } from '../check/entities/check.entity';
import { Lcn } from '../lcn/entities/lcn.entity';
import { Client } from '../client/entities/client.entity';
import { Fournisseur } from '../fournisseur/entities/fournisseur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Check, Lcn, Client, Fournisseur])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
