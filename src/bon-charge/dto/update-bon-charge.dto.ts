import { PartialType } from '@nestjs/mapped-types';
import { CreateBonChargeDto } from './create-bon-charge.dto';

export class UpdateBonChargeDto extends PartialType(CreateBonChargeDto) {}
