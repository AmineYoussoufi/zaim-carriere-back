import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaireDto } from './create-salaire.dto';

export class UpdateSalaireDto extends PartialType(CreateSalaireDto) {}
