import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShortUrl } from "src/schemas/url.schema";
import { IUrlRepository } from "./interfaces/url.repository.interface";

@Injectable()
export class UrlRepository implements IUrlRepository {
    constructor(
        @InjectModel(ShortUrl.name)
        private model: Model<ShortUrl>
    ) { }


    create(data: Partial<ShortUrl>) {
        return this.model.create(data)
    }

    findByCode(code: string) {
        return this.model.findOne({ shortCode: code })
    }

    findByUser(userId: string) {
        return this.model.find({ userId })
    }
}