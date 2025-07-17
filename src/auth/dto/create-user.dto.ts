import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  email: string;

  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  emailVerified: boolean;

  phoneNumberVerified: boolean;

  userType: string;

  userId: string;
}
