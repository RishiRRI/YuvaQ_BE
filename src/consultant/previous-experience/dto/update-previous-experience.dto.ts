import { PartialType } from '@nestjs/mapped-types';
import { CreatePreviousExperienceDto } from './create-previous-experience.dto';

export class UpdatePreviousExperienceDto extends PartialType(CreatePreviousExperienceDto) {}
