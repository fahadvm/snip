import { ShortUrl } from "src/schemas/url.schema";

export interface IUrlRepository {
    create(data: Partial<ShortUrl>): Promise<ShortUrl>

    findByCode(code: string): Promise<ShortUrl | null>

    findByUser(userId: string): Promise<ShortUrl[]>

    findById(id: string): Promise<ShortUrl | null>

    incrementClicks(id: string): Promise<void>
}