import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  presentCity: string;

  @IsString()
  presentState: string;

  @IsArray()
  @ArrayNotEmpty()
  businessInterest: string[];

  clientImage: string;

  referredBy?: string;

  // @IsNumber()
  // @Min(0)
  // yearsOfExperience: number;
}
