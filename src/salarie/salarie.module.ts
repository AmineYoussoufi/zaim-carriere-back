import { Module } from '@nestjs/common';
import { SalarieService } from './salarie.service';
import { SalarieController } from './salarie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salarie } from './entities/salarie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salarie])],
  controllers: [SalarieController],
  providers: [SalarieService],
})
export class SalarieModule {}
