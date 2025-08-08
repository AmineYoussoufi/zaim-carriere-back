import { PartialType } from '@nestjs/mapped-types';
import { CreateVisiteTechniqueDto } from './create-visite-technique.dto';

export class UpdateVisiteTechniqueDto extends PartialType(
  CreateVisiteTechniqueDto,
) {}
