import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PreviousExperience extends Document {
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  previousSalary: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const PreviousExperienceSchema =
  SchemaFactory.createForClass(PreviousExperience);
