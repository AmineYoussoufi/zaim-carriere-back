import { PartialType } from '@nestjs/mapped-types';
import { CreatePieceDeRechangeDto } from './create-piece-de-rechange.dto';

export class UpdatePieceDeRechangeDto extends PartialType(
  CreatePieceDeRechangeDto,
) {}
