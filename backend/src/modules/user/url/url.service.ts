import { Inject, Injectable } from '@nestjs/common';
import nanoid from 'nanoid'
import type { IUrlRepository } from './interfaces/url.repository.interface';



@Injectable()
export class UrlService implements IUrlService {

    constructor(
        @Inject("IUrlRepository")
        private readonly urlRepo: IUrlRepository,

    ) { }

    async create(originalUrl: string, userId: string) {
        const shortCode = nanoid(7);

        return this.urlRepo.create({
            originalUrl,
            shortCode,
            userId,
        });
    }

    async redirect(url: string) {
        const details = await this.urlRepo.findByCode(url)
        return details?.originalUrl
    }

    async listing(userId: string) {
        const allUrls = await this.urlRepo.findByUser(userId)
        return allUrls
    }



}



