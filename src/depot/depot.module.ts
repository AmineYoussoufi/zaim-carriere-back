import { Module } from '@nestjs/common';
import { DepotService } from './depot.service';
import { DepotController } from './depot.controller';
import { Depot } from './entities/depot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Depot])],
  controllers: [DepotController],
  providers: [DepotService],
})
export class DepotModule {}
