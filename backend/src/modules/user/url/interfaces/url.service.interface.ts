import { ShortUrlDocument } from './url.types';

export interface IUrlService {
    create(originalUrl: string, userId: string, customCode?: string): Promise<ShortUrlDocument>;
    redirect(code: string): Promise<string | undefined>;
    listing(userId: string, page: number, limit: number, search?: string): Promise<{ data: ShortUrlDocument[], total: number }>;
    getDetails(id: string): Promise<ShortUrlDocument | null>;
    update(id: string, originalUrl: string): Promise<ShortUrlDocument | null>;
}
