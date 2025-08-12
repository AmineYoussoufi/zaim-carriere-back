import { Module } from '@nestjs/common';
import { AchatTypesService } from './achat-type.service';
import { AchatTypesController } from './achat-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchatType } from './entities/achat-type.entity';

@Module({
  controllers: [AchatTypesController],
  providers: [AchatTypesService],
  imports: [TypeOrmModule.forFeature([AchatType])],
})
export class AchatTypeModule {}
