import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { ShortUrl } from "src/schemas/url.schema";
import { ShortUrlDocument } from "./interfaces/url.types";
import { IUrlRepository } from "./interfaces/url.repository.interface";

@Injectable()
export class UrlRepository implements IUrlRepository {
    constructor(
        @InjectModel(ShortUrl.name)
        private model: mongoose.Model<ShortUrlDocument>
    ) { }

    create(data: Partial<ShortUrl>): Promise<ShortUrlDocument> {
        return this.model.create(data)
    }

    findByCode(code: string): Promise<ShortUrlDocument | null> {
        return this.model.findOne({ shortCode: code }).exec()
    }

    async findByUser(userId: string, page: number, limit: number, search?: string): Promise<{ data: ShortUrlDocument[], total: number }> {
        const query: any = { userId };

        if (search) {
            query.$or = [
                { originalUrl: { $regex: search, $options: 'i' } },
                { shortCode: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.model.countDocuments(query).exec()
        ]);

        return { data, total };
    }

    findById(id: string): Promise<ShortUrlDocument | null> {
        return this.model.findById(id).exec();
    }

    async incrementClicks(id: string): Promise<void> {
        await this.model.findByIdAndUpdate(id, { $inc: { clicks: 1 } }).exec();
    }

    async update(id: string, data: Partial<ShortUrl>): Promise<ShortUrlDocument | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<ShortUrlDocument | null> {
        return this.model.findByIdAndDelete(id).exec();
    }
}