import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingDetailDto } from './create-meeting-detail.dto';

export class UpdateMeetingDetailDto extends PartialType(CreateMeetingDetailDto) {}
