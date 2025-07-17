import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Model } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Consultant extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: false, required: false })
  phoneNumber: string;

  @Prop()
  emergencyPhoneNumber: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  consultantImage: string;

  @Prop()
  gender: string;

  @Prop()
  DOJ: Date;

  @Prop()
  DOB: Date;

  @Prop()
  presentAddress: string;

  @Prop()
  presentCity: string;

  @Prop()
  presentState: string;

  @Prop()
  presentPincode: string;

  @Prop({ required: false })
  listOfQualification: string[];

  @Prop({ required: false })
  listOfPreviousExperience: string[];

  @Prop({ required: false })
  listOfExpertise: string[];

  @Prop()
  division: string;

  @Prop()
  department: string;

  @Prop({ required: false })
  languages: string[];

  @Prop()
  consultationRate: number;

  @Prop()
  shift: string;

  // @Prop()
  // bookingInADay: number;

  @Prop({ required: false })
  availableTime: string[][];

  // @Prop({ required: false, type: [[String]] })
  // workPermit: string[];

  @Prop({ unique: true, minlength: 6, maxlength: 6 })
  referralCode: string;

  /**
   * dayOfWeek: 0 (Sun) … 6 (Sat)
   * start, end: "HH:mm" 24-hour (e.g. "07:00")
   */
  @Prop({
    type: [{ dayOfWeek: Number, start: String, end: String }],
    default: [],
  })
  weeklySchedule: {
    dayOfWeek: number;
    start: string; // "07:00"
    end: string; // "10:30"
  }[];
}

export const ConsultantSchema = SchemaFactory.createForClass(Consultant);

ConsultantSchema.pre('validate', async function (next) {
  if (this.isNew && !this.referralCode) {
    const code = () =>
      [...Array(6)]
        .map(
          () =>
            'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)],
        )
        .join('');
    const Model = this.constructor as Model<Consultant>;
    let unique = false;
    while (!unique) {
      const tryCode = code();
      const exists = await Model.exists({ referralCode: tryCode });
      if (!exists) {
        this.referralCode = tryCode;
        unique = true;
      }
    }
  }
  next();
});
