import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShortUrl } from "src/schemas/url.schema";
import { ShortUrlDocument } from "./interfaces/url.types";
import { IUrlRepository } from "./interfaces/url.repository.interface";

@Injectable()
export class UrlRepository implements IUrlRepository {
    constructor(
        @InjectModel(ShortUrl.name)
        private model: Model<ShortUrlDocument>
    ) { }

    create(data: Partial<ShortUrl>): Promise<ShortUrlDocument> {
        return this.model.create(data)
    }

    findByCode(code: string): Promise<ShortUrlDocument | null> {
        return this.model.findOne({ shortCode: code }).exec()
    }

    findByUser(userId: string, search?: string): Promise<ShortUrlDocument[]> {
        const query: any = { userId };

        if (search) {
            query.$or = [
                { originalUrl: { $regex: search, $options: 'i' } },
                { shortCode: { $regex: search, $options: 'i' } }
            ];
        }

        return this.model.find(query).sort({ createdAt: -1 }).exec();
    }

    findById(id: string): Promise<ShortUrlDocument | null> {
        return this.model.findById(id).exec();
    }

    async incrementClicks(id: string): Promise<void> {
        await this.model.findByIdAndUpdate(id, { $inc: { clicks: 1 } }).exec();
    }
}