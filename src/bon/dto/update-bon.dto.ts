import { PartialType } from '@nestjs/mapped-types';
import { CreateBonDto } from './create-bon.dto';

export class UpdateBonDto extends PartialType(CreateBonDto) {}
