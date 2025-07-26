import { PartialType } from '@nestjs/mapped-types';
import { CreateLcnDto } from './create-lcn.dto';

export class UpdateLcnDto extends PartialType(CreateLcnDto) {}
