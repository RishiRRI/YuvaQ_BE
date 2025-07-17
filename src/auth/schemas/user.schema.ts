import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
const bcrypt = require('bcryptjs');

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneNumberVerified: boolean;

  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  userAccess: string[];

  @Prop({ required: true })
  userType: string; // 'client' | 'consultant' | 'admin' | 'mediator'

  @Prop()
  userId: string;

  @Prop({ type: Object, required: false })
  googleTokens?: any; // { access_token, refresh_token, expiry_date, ... }

  @Prop({ required: true, default: false })
  isSuperAdmin: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: '' })
  fcmToken: string;

  @Prop()
  deviceHistory: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
