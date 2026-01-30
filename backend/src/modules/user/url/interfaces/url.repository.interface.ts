
import { ShortUrl } from "src/schemas/url.schema";
import { ShortUrlDocument } from "./url.types";

export interface IUrlRepository {
    create(data: Partial<ShortUrl>): Promise<ShortUrlDocument>

    findByCode(code: string): Promise<ShortUrlDocument | null>

    findByUser(userId: string, page: number, limit: number, search?: string): Promise<{ data: ShortUrlDocument[], total: number }>

    findById(id: string): Promise<ShortUrlDocument | null>

    incrementClicks(id: string): Promise<void>

    update(id: string, data: Partial<ShortUrl>): Promise<ShortUrlDocument | null>

    delete(id: string): Promise<ShortUrlDocument | null>
}