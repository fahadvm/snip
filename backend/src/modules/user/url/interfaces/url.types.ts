import { Types } from 'mongoose';
import { ShortUrl } from 'src/schemas/url.schema';

export type ShortUrlDocument = ShortUrl & {
    _id: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};
