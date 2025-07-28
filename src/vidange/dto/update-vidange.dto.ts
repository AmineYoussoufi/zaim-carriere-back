import { PartialType } from '@nestjs/mapped-types';
import { CreateVidangeDto } from './create-vidange.dto';

export class UpdateVidangeDto extends PartialType(CreateVidangeDto) {}
