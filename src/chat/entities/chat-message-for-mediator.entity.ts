
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ChatMessageForMediator {
  @Prop({ required: true, enum: ['mediator', 'client'] })
  sender: 'mediator' | 'client';

  @Prop({ required: true })
  body: string;

  @Prop({ default: () => new Date() })
  sentAt: Date;
}
export const ChatMessageForMediatorSchema = SchemaFactory.createForClass(ChatMessageForMediator);
