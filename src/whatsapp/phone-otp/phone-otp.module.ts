import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneOtp, PhoneOtpSchema } from './entities/phone-otp.entity';
import { PhoneOtpService } from './phone-otp.service';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PhoneOtp.name, schema: PhoneOtpSchema }],
      'Yuva',
    ),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'Yuva',
    ),
  ],
  providers: [PhoneOtpService],
  exports: [PhoneOtpService],
})
export class PhoneOtpModule {}