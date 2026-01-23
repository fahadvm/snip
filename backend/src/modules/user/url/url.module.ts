import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Click, ClickSchema } from 'src/schemas/click.schema';
import { ClickRepository } from './click.repository';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from './url.repository';
import { UrlSchema } from 'src/schemas/url.schema';
import { ShortUrl } from 'src/schemas/url.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ShortUrl.name, schema: UrlSchema },
            { name: Click.name, schema: ClickSchema }
        ]),
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
        {
            provide: 'IClickRepository',
            useClass: ClickRepository,
        }
    ],
    exports: ['IUrlService'],
})
export class UrlModule { }
