import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Qualification extends Document {
  @Prop({ required: true })
  university: string;

  @Prop({ required: false })
  college: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const QualificationSchema = SchemaFactory.createForClass(Qualification);
