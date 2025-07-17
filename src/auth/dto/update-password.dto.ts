import { IsMongoId, IsNotEmpty, Length } from 'class-validator';

export class UpdatePinDto {
  @IsNotEmpty()
  @IsMongoId()
  uid: string;

  @IsNotEmpty()
  password: string;
}
