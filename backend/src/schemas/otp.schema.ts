import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now, expires: 600 }) // 10 minutes
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
