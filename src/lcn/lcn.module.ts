import { Module } from '@nestjs/common';
import { LcnService } from './lcn.service';
import { LcnController } from './lcn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lcn } from './entities/lcn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lcn])],
  controllers: [LcnController],
  providers: [LcnService],
})
export class LcnModule {}
