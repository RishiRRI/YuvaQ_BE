import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PhoneOtp extends Document {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  otpHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  verified: boolean;
}

export const PhoneOtpSchema = SchemaFactory.createForClass(PhoneOtp);