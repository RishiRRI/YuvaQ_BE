import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmailOtp extends Document {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) otpHash: string;
  @Prop({ required: true }) expiresAt: Date;
  @Prop({ default: false }) verified: boolean;
}

export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);
