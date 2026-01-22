import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IUrlService } from './interfaces/url.service.interface';
import type { IUrlRepository } from './interfaces/url.repository.interface';
import * as crypto from 'crypto';

@Injectable()
export class UrlService implements IUrlService {

    constructor(
        @Inject("IUrlRepository")
        private readonly urlRepo: IUrlRepository,
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

    async redirect(code: string) {
        const details = await this.urlRepo.findByCode(code);
        if (details) {
            await this.urlRepo.incrementClicks(details._id.toString());
        }
        return details?.originalUrl;
    }

    async listing(userId: string, page: number, limit: number, search?: string) {
        return this.urlRepo.findByUser(userId, page, limit, search);
    }

    async getDetails(id: string) {
        return this.urlRepo.findById(id);
    }
}
