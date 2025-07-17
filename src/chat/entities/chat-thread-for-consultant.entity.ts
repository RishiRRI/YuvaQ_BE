import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import {
  ChatMessageForConsultantSchema,
  ChatMessageForConsultant,
} from './chat-message-for-consultant.entity';

@Schema({ timestamps: true })
export class ChatThreadForConsultant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Consultant', required: true })
  consultantId: string;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: string;

  @Prop({ type: [ChatMessageForConsultantSchema], default: [] })
  messages: ChatMessageForConsultant[];
}
export const ChatThreadForConsultantSchema = SchemaFactory.createForClass(
  ChatThreadForConsultant,
);
