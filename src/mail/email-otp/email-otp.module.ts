import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailOtp, EmailOtpSchema } from './entities/email-otp.entity';
import { EmailOtpService } from './email-otp.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail.module';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: EmailOtp.name, schema: EmailOtpSchema }],
      'Yuva',
    ),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'Yuva',
    ),
    MailModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [EmailOtpService],
  exports: [EmailOtpService],
})
export class EmailOtpModule {}
