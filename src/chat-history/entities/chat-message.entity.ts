import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ required: true, enum: ['client', 'consultant'] })
  sender: 'client' | 'consultant';

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, default: () => new Date() })
  sentAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
