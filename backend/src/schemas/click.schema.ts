import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type ClickDocument = Click & Document;

@Schema({ timestamps: true })
export class Click {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ShortUrl', required: true })
    urlId: string;

    @Prop({ required: false })
    ip: string;

    @Prop({ required: false })
    userAgent: string;

    @Prop({ required: false })
    country: string;

    @Prop({ required: false })
    city: string;
}

export const ClickSchema = SchemaFactory.createForClass(Click);
