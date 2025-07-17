import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ChatMessageForConsultant {
  @Prop({ required: true, enum: ['consultant', 'client'] })
  sender: 'consultant' | 'client';

  @Prop({ required: true })
  body: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ default: () => new Date() })
  sentAt: Date;
}
export const ChatMessageForConsultantSchema = SchemaFactory.createForClass(
  ChatMessageForConsultant,
);
