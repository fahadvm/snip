import { Inject, Injectable } from '@nestjs/common';
import type { IUrlService } from './interfaces/url.service.interface';
import type { IUrlRepository } from './interfaces/url.repository.interface';
import * as crypto from 'crypto';

@Injectable()
export class UrlService implements IUrlService {

    constructor(
        @Inject("IUrlRepository")
        private readonly urlRepo: IUrlRepository,
    ) { }

    async create(originalUrl: string, userId: string) {
        const shortCode = crypto.randomBytes(4).toString('hex'); // 8 characters

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

    async listing(userId: string) {
        return this.urlRepo.findByUser(userId);
    }

    async getDetails(id: string) {
        return this.urlRepo.findById(id);
    }
}
