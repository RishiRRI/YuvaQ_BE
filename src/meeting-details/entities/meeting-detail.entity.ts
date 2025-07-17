import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class MeetingDetail extends Document {
  @Prop({ required: true })
  consultantId: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: false })
  meetingLink: string;

  @Prop({ required: true }) //'scheduled', 'completed', 'cancelled',
  meetingStatus: string;

  @Prop({ required: false })
  startDateTime: Date;

  @Prop({ required: false })
  endDateTime: Date;

  @Prop({ required: false })
  paymentId: string;
}

export const MeetingDetailSchema = SchemaFactory.createForClass(MeetingDetail);
