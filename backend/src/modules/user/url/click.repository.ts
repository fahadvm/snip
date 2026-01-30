import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import  { Model, Types } from "mongoose";
import { Click, ClickDocument } from "src/schemas/click.schema";
import { IClickRepository } from "./interfaces/click.repository.interface";
import { AggregatedClickData } from "./interfaces/analytics.interface";

@Injectable()
export class ClickRepository implements IClickRepository {
    constructor(
        @InjectModel(Click.name) private readonly clickModel: Model<ClickDocument>
    ) { }

    async create(data: { urlId: string; ip?: string; userAgent?: string; country?: string; city?: string }): Promise<ClickDocument> {
        return this.clickModel.create(data);
    }

    async getAnalytics(urlId: string, range: 'weekly' | 'monthly' | 'yearly'): Promise<AggregatedClickData[]> {
        const objectId = new Types.ObjectId(urlId);
        const now = new Date();
        let matchStage:any = { urlId: objectId };
        let groupId: Record<string, string | object> = {};
        let sortId: Record<string, 1 | -1> = {};

        if (range === 'weekly') {
            // Last 7 days - group by day
            const last7Days = new Date(now);
            last7Days.setDate(now.getDate() - 7);
            matchStage.createdAt = { $gte: last7Days };
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" }
            };
            sortId = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
        } else if (range === 'monthly') {
            // All months of current year - group by month
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            matchStage.createdAt = { $gte: startOfYear, $lte: endOfYear };
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
            };
            sortId = { "_id.year": 1, "_id.month": 1 };
        } else if (range === 'yearly') {
            // Last 3 years + current year (4 years total) - group by year
            const currentYear = now.getFullYear();
            const startYear = new Date(currentYear - 3, 0, 1);
            matchStage.createdAt = { $gte: startYear };
            groupId = {
                year: { $year: "$createdAt" }
            };
            sortId = { "_id.year": 1 };
        }

        const aggregation = [
            { $match: matchStage },
            {
                $group: {
                    _id: groupId,
                    count: { $sum: 1 }
                }
            },
            { $sort: sortId }
        ];

        const results = await this.clickModel.aggregate(aggregation);
        return results as AggregatedClickData[];
    }
}
