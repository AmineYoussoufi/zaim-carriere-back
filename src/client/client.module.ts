import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Paiement } from 'src/bon/entities/paiement.entity';
import { Entree } from 'src/entree/entities/entree.entity';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [TypeOrmModule.forFeature([Client, Paiement, Entree])],
})
export class ClientModule {}
