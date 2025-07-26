import { Module } from '@nestjs/common';
import { PieceDeRechangeService } from './piece-de-rechange.service';
import { PieceDeRechangeController } from './piece-de-rechange.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PieceDeRechange } from './entities/piece-de-rechange.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PieceDeRechange])],
  controllers: [PieceDeRechangeController],
  providers: [PieceDeRechangeService],
})
export class PieceDeRechangeModule {}
