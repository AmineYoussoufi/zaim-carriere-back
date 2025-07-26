import { Module } from '@nestjs/common';
import { EntreeService } from './entree.service';
import { EntreeController } from './entree.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entree } from './entities/entree.entity';

@Module({
  controllers: [EntreeController],
  providers: [EntreeService],
  imports: [TypeOrmModule.forFeature([Entree])],
})
export class EntreeModule {}
