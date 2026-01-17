import { ShortUrl } from "src/schemas/url.schema";
import { ShortUrlDocument } from "./url.types";

export interface IUrlRepository {
    create(data: Partial<ShortUrl>): Promise<ShortUrlDocument>

    findByCode(code: string): Promise<ShortUrlDocument | null>

    findByUser(userId: string): Promise<ShortUrlDocument[]>

    findById(id: string): Promise<ShortUrlDocument | null>

    incrementClicks(id: string): Promise<void>
}