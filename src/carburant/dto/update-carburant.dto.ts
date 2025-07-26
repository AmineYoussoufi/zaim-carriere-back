import { PartialType } from '@nestjs/mapped-types';
import { CreateCarburantDto } from './create-carburant.dto';

export class UpdateCarburantDto extends PartialType(CreateCarburantDto) {}
