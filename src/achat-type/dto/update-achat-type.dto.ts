import { PartialType } from '@nestjs/mapped-types';
import { CreateAchatTypeDto } from './create-achat-type.dto';

export class UpdateAchatTypeDto extends PartialType(CreateAchatTypeDto) {}
