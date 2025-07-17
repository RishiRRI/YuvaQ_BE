import { IsString } from 'class-validator';

export class CreateExpertiseDto {
  @IsString()
  areaName: string;
}
