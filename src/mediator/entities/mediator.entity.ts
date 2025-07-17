import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Mediator extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: false })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;
}

export const MediatorSchema = SchemaFactory.createForClass(Mediator);
