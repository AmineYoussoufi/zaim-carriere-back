import { Module } from '@nestjs/common';
import { SalaireService } from './salaire.service';
import { SalaireController } from './salaire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salaire } from './entities/salaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salaire])],
  controllers: [SalaireController],
  providers: [SalaireService],
})
export class SalaireModule {}
