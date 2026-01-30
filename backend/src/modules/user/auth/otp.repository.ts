import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Otp } from "src/schemas/otp.schema";
import { IOtpRepository } from "./interfaces/otp.repository.interface";


@Injectable()
export class OtpRepository implements IOtpRepository {
    constructor(
        @InjectModel(Otp.name)
        private readonly otpModel: mongoose.Model<Otp>
    ) { }

    async upsertOtp(email: string, data: Partial<Otp>): Promise<void> {
        await this.otpModel.findOneAndUpdate(
            { email },
            { ...data, createdAt: new Date() },
            { upsert: true }
        ).exec();
    }

        async findOne(email: string, otp?: string): Promise<Otp | null> {
            const query :any = { email };
            if (otp) query.otp = otp;
            return this.otpModel.findOne(query).exec();
        }

    async delete(id: string): Promise<void> {
        await this.otpModel.findByIdAndDelete(id).exec();
    }
}
