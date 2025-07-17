import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { EmailOtp } from './entities/email-otp.entity';
import { MailService } from '../mail.service';

@Injectable()
export class EmailOtpService {
  constructor(
    @InjectModel(EmailOtp.name, 'Yuva')
    private readonly model: Model<EmailOtp>,
    private readonly mail: MailService,
  ) {}

  async sendOtp(email: string) {
    const six = crypto.randomInt(100000, 1000000).toString();
    const hash = crypto.createHash('sha256').update(six).digest('hex');

    await this.model.findOneAndUpdate(
      { email },
      {
        email,
        otpHash: hash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false,
      },
      { upsert: true, new: true },
    );

    await this.mail.sendOtpEmail(email, six);
  }

  async verifyOtp(email: string, code: string): Promise<string> {
    const rec = await this.model.findOne({ email });
    if (
      !rec ||
      rec.verified ||
      rec.expiresAt.getTime() < Date.now() ||
      rec.otpHash !== crypto.createHash('sha256').update(code).digest('hex')
    ) {
      throw new BadRequestException('OTP invalid or expired');
    }
    rec.verified = true;
    await rec.save();

    const jwt = await import('@nestjs/jwt');
    const jwtService = new jwt.JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    });
    return jwtService.sign({ email, otpVerified: true });
  }

  async assertEmailVerified(signupToken: string) {
    const jwt = await import('@nestjs/jwt');
    const jwtService = new jwt.JwtService({ secret: process.env.JWT_SECRET });
    const payload: any = jwtService.verify(signupToken);
    if (!payload?.otpVerified || !payload?.email) {
      throw new BadRequestException('E‑mail not verified');
    }

    const rec = await this.model.findOne({ email: payload.email });
    if (!rec || !rec.verified)
      throw new BadRequestException('E‑mail not verified');
    return payload.email;
  }
}
