import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TimeWindowDto } from './time-window.dto';

export class CreateConsultantDto {
  @IsString() fullName: string;
  @IsEmail() email: string;
  @IsString() phoneNumber: string;
  @IsString() emergencyPhoneNumber?: string;
  isVerified: boolean;
  consultantImage: string;
  @IsString() gender: string;
  // @IsString() maritalStatus: string;
  @IsDateString() DOJ: Date;
  @IsDateString() DOB: Date;
  @IsString() presentAddress: string;
  @IsString() presentCity: string;
  @IsString() presentState: string;
  @IsString() presentPincode: string;
  // @IsString() professionalBio: string;

  @IsArray() listOfQualification: string[];
  @IsArray() listOfPreviousExperience: string[];
  @IsArray() listOfExpertise: string[];
  // @IsArray() keySkills: string[];
  @IsString() division: string;
  @IsString() department: string;
  @IsArray() languages: string[];

  @IsNumber() consultationRate: number;
  @IsString() shift: string;
  // @IsArray() workPermit: string[];
  // @IsNumber() bookingInADay: number;
  // @IsArray() availableTime: string[][];

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TimeWindowDto)
  weeklySchedule?: TimeWindowDto[];
}
