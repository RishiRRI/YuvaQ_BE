import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  fullName: string;

  phoneNumber: string;

  email: string;

  isActive: boolean;

  userAccess: string[];

  userType: string[];

  googleTokens: any;
}
