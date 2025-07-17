import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ChatMessageSchema, ChatMessage } from './chat-message.entity';

@Schema({ timestamps: true })
export class ChatHistory extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Client' })
  clientId: string;

  @Prop({ required: true })
  clientName: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Consultant',
  })
  consultantId: string;

  @Prop({ required: true })
  consultantName: string;

  @Prop({ required: true })
  businessArea: string;

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
