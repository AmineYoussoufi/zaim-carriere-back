import { Module } from '@nestjs/common';
import { CarburantService } from './carburant.service';
import { CarburantController } from './carburant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carburant } from './entities/carburant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carburant])],
  controllers: [CarburantController],
  providers: [CarburantService],
})
export class CarburantModule {}
