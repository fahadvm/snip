import { ShortUrlDocument } from './url.types';

export interface IUrlService {
    create(originalUrl: string, userId: string, customCode?: string): Promise<ShortUrlDocument>;
    redirect(code: string): Promise<string | undefined>;
    listing(userId: string, search?: string): Promise<ShortUrlDocument[]>;
    getDetails(id: string): Promise<ShortUrlDocument | null>;
}
