import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controller/user.controller';
import { ConfigService } from '@nestjs/config';
import { UserService } from './service/user.service';

import { MailModule } from '../mail/mail.module';
import { EmailOtpModule } from '../mail/email-otp/email-otp.module';
import { WhatsAppModule } from 'src/whatsapp/whatsapp.module';
import { PhoneOtpModule } from 'src/whatsapp/phone-otp/phone-otp.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string | number>('JWT_EXPIRES') },
      }),
    }),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'Yuva',
    ),

    MailModule,
    EmailOtpModule,
    WhatsAppModule,
    PhoneOtpModule,
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, UserService],
})
export class AuthModule {}
