import { ShortUrl } from 'src/schemas/url.schema';
import { UrlResponseDto } from '../dto/url-response.dto';
import { Types } from 'mongoose';

export class UrlMapper {
    static toDto(url: ShortUrl & { _id: Types.ObjectId, createdAt?: Date }, customBase?: string): UrlResponseDto {
        const baseUrl = customBase || process.env.BASE_URL || 'http://localhost:5005/api/url';
        return {
            id: url._id.toString(),
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/r/${url.shortCode}`,
            clicks: url.clicks,
            createdAt: url.createdAt || new Date(),
        };
    }

    static toDtoList(urls: (ShortUrl & { _id: Types.ObjectId, createdAt?: Date })[], customBase?: string): UrlResponseDto[] {
        return urls.map((url) => this.toDto(url, customBase));
    }
}