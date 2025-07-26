import { Module } from '@nestjs/common';
import { StockOperationService } from './stock-operation.service';
import { StockOperationController } from './stock-operation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOperation } from './entities/stock-operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockOperation])],
  controllers: [StockOperationController],
  providers: [StockOperationService],
})
export class StockOperationModule {}
