import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true }) orderId: string;
  @Prop({ required: true }) paymentId: string;
  @Prop({ required: true }) amount: number;         
  @Prop({ required: true }) currency: string;
  @Prop({ required: true }) status: string;       
  @Prop() method?: string;                       
  @Prop() email?:  string;
  @Prop() contact?:string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
