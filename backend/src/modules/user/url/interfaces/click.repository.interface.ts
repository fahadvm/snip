import { ClickDocument } from "src/schemas/click.schema";
import { AggregatedClickData } from "./analytics.interface";

export interface IClickRepository {
    create(data: { urlId: string; ip?: string; userAgent?: string; country?: string; city?: string }): Promise<ClickDocument>;
    getAnalytics(urlId: string, range: 'weekly' | 'monthly' | 'yearly'): Promise<AggregatedClickData[]>;
}
