import { ClickDocument } from "src/schemas/click.schema";

export interface IClickRepository {
    create(data: { urlId: string; ip?: string; userAgent?: string; country?: string; city?: string }): Promise<ClickDocument>;
    getAnalytics(urlId: string, range: 'weekly' | 'monthly' | 'yearly'): Promise<any[]>;
}
