import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Client extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: false })
  phoneNumber: string;

  //   @Prop({ required: true })
  //   presentAddress: string;

  @Prop({ required: false })
  presentCity: string;

  @Prop({ required: false })
  presentState: string;

  @Prop({ required: false })
  interestedBusinessArea: string[];

  @Prop()
  clientImage: string;

  // @Prop({ required: true })
  // yearsOfExperience: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Consultant' })
  referredBy?: string;

  @Prop({ default: false })
  firstFreeMeetingUsed: boolean;

  // @Prop({ default: false })
  // freeConsultUsed: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
