import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultantDetailDto } from './create-consultant-detail.dto';

export class UpdateConsultantDetailDto extends PartialType(CreateConsultantDetailDto) {}
