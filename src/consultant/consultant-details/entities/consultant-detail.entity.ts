import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ConsultantDetail extends Document {
  @Prop({ required: true })
  division: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  workType: string;

  @Prop({ required: true, type: [[String]] })
  languages: string[];

  @Prop({ required: true, type: [[String]] })
  typeOfConversation: string[];
}

export const ConsultantDetailSchema =
  SchemaFactory.createForClass(ConsultantDetail);
