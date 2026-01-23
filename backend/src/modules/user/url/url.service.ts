import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IUrlService } from './interfaces/url.service.interface';
import type { IUrlRepository } from './interfaces/url.repository.interface';
import * as crypto from 'crypto';
import type { IClickRepository } from './interfaces/click.repository.interface';

@Injectable()
export class UrlService implements IUrlService {

    constructor(
        @Inject("IUrlRepository")
        private readonly urlRepo: IUrlRepository,
        @Inject("IClickRepository")
        private readonly clickRepo: IClickRepository,
    ) { }

    async create(originalUrl: string, userId: string, customCode?: string) {
        let shortCode: string;

        if (customCode) {
            // Validate custom code format (alphanumeric, hyphens, underscores only)
            if (!/^[a-zA-Z0-9_-]+$/.test(customCode)) {
                throw new BadRequestException('Custom code can only contain letters, numbers, hyphens, and underscores');
            }

            // Check if custom code already exists
            const existing = await this.urlRepo.findByCode(customCode);
            if (existing) {
                throw new BadRequestException('This custom code is already taken. Please choose another one.');
            }

            shortCode = customCode;
        } else {
            // Generate random code
            shortCode = crypto.randomBytes(4).toString('hex');
        }

        return this.urlRepo.create({
            originalUrl,
            shortCode,
            userId,
        });
    }

    // Simple in-memory cache for recent redirects to prevent double-counting (short-lived)
    private recentRedirects = new Map<string, number>();

    async redirect(code: string, ip?: string, userAgent?: string) {
        // Clean up old cache entries occasionally
        if (this.recentRedirects.size > 1000) this.recentRedirects.clear();

        const cacheKey = `${code}-${ip || 'unknown'}`;
        const now = Date.now();
        const lastHit = this.recentRedirects.get(cacheKey);

        // If hit within last 2 seconds from same IP, ignore for counting
        const isDuplicate = lastHit && (now - lastHit < 2000);

        console.log(`[UrlService] Redirecting code: ${code} | IP: ${ip} | Duplicate: ${isDuplicate}`);

        const details = await this.urlRepo.findByCode(code);
        if (details && !isDuplicate) {
            this.recentRedirects.set(cacheKey, now);

            await Promise.all([
                this.urlRepo.incrementClicks(details._id.toString()),
                this.clickRepo.create({
                    urlId: details._id.toString(),
                    ip,
                    userAgent
                })
            ]);
        }

        return details?.originalUrl;
    }

    // ... listing and getDetails ...

    async getAnalytics(id: string, range: string) {
        const validRanges = ['weekly', 'monthly', 'yearly'];
        if (!validRanges.includes(range)) {
            throw new BadRequestException('Invalid range. Must be weekly, monthly, or yearly');
        }

        const data = await this.clickRepo.getAnalytics(id, range as 'weekly' | 'monthly' | 'yearly');

        // Fill gaps
        return this.fillGaps(data, range as 'weekly' | 'monthly' | 'yearly');
    }

    private fillGaps(data: any[], range: 'weekly' | 'monthly' | 'yearly') {
        const result: any[] = [];
        const now = new Date();
        const dataMap = new Map();

        data.forEach(item => {
            const key = range === 'yearly'
                ? `${item._id.year}`
                : range === 'monthly'
                    ? `${item._id.year}-${item._id.month}`
                    : `${item._id.year}-${item._id.month}-${item._id.day}`;
            dataMap.set(key, item.count);
        });

        if (range === 'weekly') {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
                result.push({
                    date: d.toISOString(),
                    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    clicks: dataMap.get(key) || 0
                });
            }
        } else if (range === 'monthly') {
            // All months from Jan to Dec of current year
            const currentYear = now.getFullYear();
            for (let month = 0; month < 12; month++) {
                const d = new Date(currentYear, month, 1);
                const key = `${currentYear}-${month + 1}`;
                result.push({
                    date: d.toISOString(),
                    label: d.toLocaleDateString('en-US', { month: 'short' }),
                    clicks: dataMap.get(key) || 0
                });
            }
        } else if (range === 'yearly') {
            // Last 3 years including current year (total 4 years)
            const currentYear = now.getFullYear();
            for (let yearOffset = 3; yearOffset >= 0; yearOffset--) {
                const year = currentYear - yearOffset;
                const key = `${year}`;
                const d = new Date(year, 0, 1);
                result.push({
                    date: d.toISOString(),
                    label: year.toString(),
                    clicks: dataMap.get(key) || 0
                });
            }
        }

        return result;
    }

    // ... update and delete ...

    async listing(userId: string, page: number, limit: number, search?: string) {
        return this.urlRepo.findByUser(userId, page, limit, search);
    }

    async getDetails(id: string) {
        return this.urlRepo.findById(id);
    }

    async update(id: string, originalUrl: string, customCode?: string) {
        const updates: any = { originalUrl };

        if (customCode) {
            // Validate format
            if (!/^[a-zA-Z0-9_-]+$/.test(customCode)) {
                throw new BadRequestException('Custom code can only contain letters, numbers, hyphens, and underscores');
            }

            // Check if current URL actually needs update
            const current = await this.urlRepo.findById(id);
            if (current && current.shortCode !== customCode) {
                // Check if taken
                const existing = await this.urlRepo.findByCode(customCode);
                if (existing) {
                    throw new BadRequestException('This custom code is already taken. Please choose another one.');
                }
                updates.shortCode = customCode;
            }
        }

        return this.urlRepo.update(id, updates);
    }

    async delete(id: string) {
        return this.urlRepo.delete(id);
    }
}
