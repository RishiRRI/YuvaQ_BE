import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import {
  ChatMessageForMediator,
  ChatMessageForMediatorSchema,
} from './chat-message-for-mediator.entity';

@Schema({ timestamps: true })
export class ChatThreadForMediator extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Mediator', required: true })
  mediatorId: string;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: string;

  @Prop({ type: [ChatMessageForMediatorSchema], default: [] })
  messages: ChatMessageForMediator[];
}
export const ChatThreadForMediatorSchema = SchemaFactory.createForClass(
  ChatThreadForMediator,
);
