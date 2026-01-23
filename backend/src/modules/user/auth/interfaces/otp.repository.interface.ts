import { Otp } from "src/schemas/otp.schema";

export interface IOtpRepository {
    upsertOtp(email: string, data: Partial<Otp>): Promise<void>;
    findOne(email: string, otp?: string): Promise<Otp | null>;
    delete(id: string): Promise<void>;
}
