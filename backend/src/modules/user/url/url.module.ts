import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrl, UrlSchema } from 'src/schemas/url.schema';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './url.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ShortUrl.name, schema: UrlSchema }]),
    ],
    controllers: [UrlController],
    providers: [
        {
            provide: 'IUrlService',
            useClass: UrlService,
        },
        {
            provide: 'IUrlRepository',
            useClass: UrlRepository,
        },
    ],
    exports: ['IUrlService'],
})
export class UrlModule { }
