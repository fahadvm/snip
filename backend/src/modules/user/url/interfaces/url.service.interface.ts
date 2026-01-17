import { ShortUrl } from 'src/schemas/url.schema';

export interface IUrlService {
    create(originalUrl: string, userId: string): Promise<ShortUrl>;
    redirect(code: string): Promise<string | undefined>;
    listing(userId: string): Promise<ShortUrl[]>;
    getDetails(id: string): Promise<ShortUrl | null>;
}
