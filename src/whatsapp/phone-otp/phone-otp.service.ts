import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import axios from 'axios';
import { PhoneOtp } from './entities/phone-otp.entity';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class PhoneOtpService {
  constructor(
    @InjectModel(PhoneOtp.name, 'Yuva')
    private readonly phoneOtpModel: Model<PhoneOtp>,
    // @InjectModel(User.name, 'Yuva')
    // private readonly userModel: Model<User>,
  ) {}

  async sendOtp(phoneNumber: string) {
    const code = crypto.randomInt(100_000, 1_000_000).toString();
    const hash = crypto.createHash('sha256').update(code).digest('hex');

    await this.phoneOtpModel.findOneAndUpdate(
      { phoneNumber },
      {
        phoneNumber,
        otpHash: hash,
        expiresAt: new Date(Date.now() + 5 * 60_000), // 5 min
        verified: false,
      },
      { upsert: true, new: true },
    );

    const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: 'yuvaq_test_auth',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: code }],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [{ type: 'text', text: code }],
          },
        ],
      },
    };

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    Logger.log(`WhatsApp OTP sent to ${phoneNumber}`);
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<void> {
    const rec = await this.phoneOtpModel.findOne({ phoneNumber });

    const isValid =
      rec &&
      !rec.verified &&
      rec.expiresAt.getTime() >= Date.now() &&
      rec.otpHash === crypto.createHash('sha256').update(code).digest('hex');

    if (!isValid) {
      throw new BadRequestException('Phone OTP invalid or expired');
    }

    rec.verified = true;
    await rec.save();

    // const user = await this.userModel.findOneAndUpdate(
    //   { phoneNumber },
    //   { phoneNumberVerified: true },
    //   { new: true },
    // );

    // if (!user) {
    //   throw new BadRequestException('No user found with this phone');
    // }
  }
}
