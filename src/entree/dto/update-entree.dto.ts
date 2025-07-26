import { PartialType } from '@nestjs/mapped-types';
import { CreateEntreeDto } from './create-entree.dto';

export class UpdateEntreeDto extends PartialType(CreateEntreeDto) {}
