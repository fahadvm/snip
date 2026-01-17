import { Schema,Prop , SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({ timestamps: true })
export class ShortUrl {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ default: 0 })
  clicks: number;
}


export const UrlSchema  = SchemaFactory.createForClass(ShortUrl)