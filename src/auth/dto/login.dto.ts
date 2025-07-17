import { IsNotEmpty, IsString, Length, min } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  type: string;
}
