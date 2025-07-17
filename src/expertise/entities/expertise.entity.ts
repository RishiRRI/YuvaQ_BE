import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Expertise extends Document {
  @Prop({unique: true, required: true })
  expertiseName: string;
}

export const ExpertiseSchema = SchemaFactory.createForClass(Expertise);
