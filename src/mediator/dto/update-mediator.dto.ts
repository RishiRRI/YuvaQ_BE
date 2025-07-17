import { PartialType } from '@nestjs/mapped-types';
import { CreateMediatorDto } from './create-mediator.dto';

export class UpdateMediatorDto extends PartialType(CreateMediatorDto) {}
